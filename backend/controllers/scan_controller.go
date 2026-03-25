package controllers

import (
	"dental-app/config"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type scanPatientSummary struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Institution string `json:"institution"`
}

type scanResponse struct {
	ID          string              `json:"id"`
	PatientID   string              `json:"patient_id"`
	PatientName string              `json:"patient_name"`
	Institution string              `json:"institution"`
	ScanDate    string              `json:"scan_date"`
	Status      string              `json:"status"`
	Token       string              `json:"token,omitempty"`
	Patient     *scanPatientSummary `json:"patient,omitempty"`
}

type reportDiagnosis struct {
	Tooth                   int    `json:"tooth"`
	Disease                 string `json:"disease"`
	Color                   string `json:"color"`
	TreatmentRecommendation string `json:"treatment_recommendation"`
}

type reportResponse struct {
	ID          string            `json:"id"`
	PatientName string            `json:"patient_name"`
	Institution string            `json:"institution"`
	Age         int               `json:"age"`
	Gender      string            `json:"gender"`
	ScanDate    string            `json:"scan_date"`
	Status      string            `json:"status"`
	Diagnosis   []reportDiagnosis `json:"diagnosis"`
}

type odontogramEntryInput struct {
	ToothNumber  int    `json:"tooth_number" binding:"required"`
	ToothSurface string `json:"tooth_surface"`
	ConditionID  string `json:"condition_id" binding:"required"`
	Notes        string `json:"notes"`
}

type createCheckupRequest struct {
	PatientID    string                 `json:"patient_id" binding:"required"`
	DentistID    string                 `json:"dentist_id" binding:"required"`
	CheckupDate  string                 `json:"checkup_date" binding:"required"`
	GeneralNotes string                 `json:"general_notes"`
	Status       string                 `json:"status"`
	Entries      []odontogramEntryInput `json:"entries"`
}

type updateCheckupRequest struct {
	PatientID      string                 `json:"patient_id"`
	DentistID      string                 `json:"dentist_id"`
	CheckupDate    string                 `json:"checkup_date"`
	GeneralNotes   string                 `json:"general_notes"`
	Status         string                 `json:"status"`
	Entries        []odontogramEntryInput `json:"entries"`
	ReplaceEntries bool                   `json:"replace_entries"`
}

func normalizeStatus(raw string) string {
	s := strings.TrimSpace(strings.ToLower(raw))
	switch s {
	case "completed":
		return "Completed"
	case "pending":
		return "Pending"
	default:
		if s == "" {
			return "Pending"
		}
		return strings.Title(s)
	}
}

func parseStatusForDB(raw string) string {
	s := strings.TrimSpace(strings.ToLower(raw))
	if s == "" {
		return "completed"
	}
	return s
}

func isValidDateYYYYMMDD(v string) bool {
	_, err := time.Parse("2006-01-02", strings.TrimSpace(v))
	return err == nil
}

func recordExists(table, id string) (bool, error) {
	var count int64
	err := config.DB.Table(table).Where("id = ?", id).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func validateEntryInputs(entries []odontogramEntryInput) error {
	for _, e := range entries {
		if e.ToothNumber <= 0 {
			return gin.Error{Err: ErrBadRequest("tooth_number must be > 0")}
		}
		if strings.TrimSpace(e.ConditionID) == "" {
			return gin.Error{Err: ErrBadRequest("condition_id is required")}
		}
	}
	return nil
}

func ErrBadRequest(msg string) error {
	return &badRequestError{Message: msg}
}

type badRequestError struct {
	Message string
}

func (e *badRequestError) Error() string { return e.Message }

func mapBadRequest(c *gin.Context, err error) bool {
	if err == nil {
		return false
	}
	if _, ok := err.(*badRequestError); ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return true
	}
	return false
}

func createOdontogramEntries(checkupID string, entries []odontogramEntryInput) error {
	for _, e := range entries {
		conditionID := strings.TrimSpace(e.ConditionID)
		surface := strings.TrimSpace(e.ToothSurface)
		notes := strings.TrimSpace(e.Notes)

		ok, err := recordExists("dental_conditions", conditionID)
		if err != nil {
			return err
		}
		if !ok {
			return ErrBadRequest("condition_id not found: " + conditionID)
		}

		query := `
			INSERT INTO odontogram_entries
				(id, checkup_id, tooth_number, tooth_surface, condition_id, notes)
			VALUES
				(UUID(), ?, ?, NULLIF(?, ''), ?, NULLIF(?, ''))
		`
		if err := config.DB.Exec(query, checkupID, e.ToothNumber, surface, conditionID, notes).Error; err != nil {
			return err
		}
	}
	return nil
}

func GetScans(c *gin.Context) {
	type scanRow struct {
		ID            string    `gorm:"column:id"`
		PatientID     string    `gorm:"column:patient_id"`
		PatientName   string    `gorm:"column:patient_name"`
		Institution   string    `gorm:"column:institution"`
		CheckupDate   time.Time `gorm:"column:checkup_date"`
		Status        string    `gorm:"column:status"`
		LatestQRToken string    `gorm:"column:latest_qr_token"`
	}

	var rows []scanRow

	err := config.DB.
		Table("checkups c").
		Select(`
			c.id,
			c.patient_id,
			p.full_name AS patient_name,
			COALESCE(pi.name, '-') AS institution,
			c.checkup_date,
			c.status,
			COALESCE(qt.token, '') AS latest_qr_token
		`).
		Joins("JOIN patients p ON p.id = c.patient_id").
		Joins("LEFT JOIN partner_institutions pi ON pi.id = p.institution_id").
		Joins(`
			LEFT JOIN qr_tokens qt
				ON qt.id = (
					SELECT q2.id
					FROM qr_tokens q2
					WHERE q2.checkup_id = c.id
					ORDER BY q2.created_at DESC
					LIMIT 1
				)
		`).
		Order("c.checkup_date DESC, c.created_at DESC").
		Scan(&rows).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch scans"})
		return
	}

	result := make([]scanResponse, 0, len(rows))
	for _, r := range rows {
		item := scanResponse{
			ID:          r.ID,
			PatientID:   r.PatientID,
			PatientName: r.PatientName,
			Institution: r.Institution,
			ScanDate:    r.CheckupDate.Format("2006-01-02"),
			Status:      normalizeStatus(r.Status),
		}

		if strings.TrimSpace(r.LatestQRToken) != "" {
			item.Token = r.LatestQRToken
		}

		item.Patient = &scanPatientSummary{
			ID:          r.PatientID,
			Name:        r.PatientName,
			Institution: r.Institution,
		}

		result = append(result, item)
	}

	c.JSON(http.StatusOK, result)
}

func GetReport(c *gin.Context) {
	idOrToken := strings.TrimSpace(c.Param("id"))
	if idOrToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report id"})
		return
	}

	type reportRow struct {
		ID          string    `gorm:"column:id"`
		PatientName string    `gorm:"column:patient_name"`
		Institution string    `gorm:"column:institution"`
		Age         *int      `gorm:"column:age"`
		Gender      string    `gorm:"column:gender"`
		CheckupDate time.Time `gorm:"column:checkup_date"`
		Status      string    `gorm:"column:status"`
	}

	var row reportRow
	err := config.DB.
		Table("checkups c").
		Select(`
			c.id,
			p.full_name AS patient_name,
			COALESCE(pi.name, '-') AS institution,
			p.age,
			COALESCE(p.gender, '') AS gender,
			c.checkup_date,
			c.status
		`).
		Joins("JOIN patients p ON p.id = c.patient_id").
		Joins("LEFT JOIN partner_institutions pi ON pi.id = p.institution_id").
		Joins("LEFT JOIN qr_tokens qt ON qt.checkup_id = c.id AND qt.is_active = 1").
		Where("c.id = ? OR qt.token = ?", idOrToken, idOrToken).
		Order("qt.created_at DESC").
		Limit(1).
		Scan(&row).Error
	if err != nil || row.ID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	report := reportResponse{
		ID:          row.ID,
		PatientName: row.PatientName,
		Institution: row.Institution,
		ScanDate:    row.CheckupDate.Format("2006-01-02"),
		Status:      normalizeStatus(row.Status),
		Diagnosis:   []reportDiagnosis{},
	}

	if row.Age != nil {
		report.Age = *row.Age
	}
	report.Gender = row.Gender

	type diagnosisRow struct {
		Tooth                   int    `gorm:"column:tooth_number"`
		Disease                 string `gorm:"column:condition_name"`
		Color                   string `gorm:"column:color_code"`
		TreatmentRecommendation string `gorm:"column:treatment_recommendation"`
	}

	var diagnosisRows []diagnosisRow
	_ = config.DB.
		Table("odontogram_entries oe").
		Select(`
			oe.tooth_number,
			dc.name AS condition_name,
			COALESCE(dc.color_code, '#10b981') AS color_code,
			COALESCE(dc.treatment_recommendation, '') AS treatment_recommendation
		`).
		Joins("JOIN dental_conditions dc ON dc.id = oe.condition_id").
		Where("oe.checkup_id = ?", row.ID).
		Order("oe.tooth_number ASC").
		Scan(&diagnosisRows).Error

	for _, d := range diagnosisRows {
		report.Diagnosis = append(report.Diagnosis, reportDiagnosis{
			Tooth:                   d.Tooth,
			Disease:                 d.Disease,
			Color:                   d.Color,
			TreatmentRecommendation: d.TreatmentRecommendation,
		})
	}

	if len(report.Diagnosis) == 0 {
		report.Diagnosis = []reportDiagnosis{
			{
				Tooth:                   17,
				Disease:                 "Karies Gigi",
				Color:                   "#E24B4A",
				TreatmentRecommendation: "Email: fluoride treatment atau penambalan. Dentin: penambalan gigi. Pulpa: perawatan saluran akar atau cabut gigi.",
			},
			{
				Tooth:                   21,
				Disease:                 "Karang Gigi",
				Color:                   "#888780",
				TreatmentRecommendation: "Scalling (pembersihan karang gigi) menggunakan alat ultrasonik oleh dokter gigi.",
			},
			{
				Tooth:                   46,
				Disease:                 "Restorasi Gigi",
				Color:                   "#1D9E75",
				TreatmentRecommendation: "Observasi secara berkala.",
			},
		}
	}

	c.JSON(http.StatusOK, report)
}

func GetCheckupByID(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid checkup id"})
		return
	}

	type checkupRow struct {
		ID           string    `gorm:"column:id" json:"id"`
		PatientID    string    `gorm:"column:patient_id" json:"patient_id"`
		PatientName  string    `gorm:"column:patient_name" json:"patient_name"`
		Institution  string    `gorm:"column:institution" json:"institution"`
		DentistID    string    `gorm:"column:dentist_id" json:"dentist_id"`
		DentistName  string    `gorm:"column:dentist_name" json:"dentist_name"`
		CheckupDate  time.Time `gorm:"column:checkup_date" json:"-"`
		GeneralNotes string    `gorm:"column:general_notes" json:"general_notes"`
		Status       string    `gorm:"column:status" json:"status"`
		CreatedAt    string    `gorm:"column:created_at" json:"created_at"`
	}

	type entryRow struct {
		ID            string `gorm:"column:id" json:"id"`
		ToothNumber   int    `gorm:"column:tooth_number" json:"tooth_number"`
		ToothSurface  string `gorm:"column:tooth_surface" json:"tooth_surface"`
		ConditionID   string `gorm:"column:condition_id" json:"condition_id"`
		ConditionName string `gorm:"column:condition_name" json:"condition_name"`
		ColorCode     string `gorm:"column:color_code" json:"color_code"`
		Notes         string `gorm:"column:notes" json:"notes"`
	}

	var row checkupRow
	err := config.DB.
		Table("checkups c").
		Select(`
			c.id,
			c.patient_id,
			p.full_name AS patient_name,
			COALESCE(pi.name, '-') AS institution,
			c.dentist_id,
			d.full_name AS dentist_name,
			c.checkup_date,
			COALESCE(c.general_notes, '') AS general_notes,
			c.status,
			DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
		`).
		Joins("JOIN patients p ON p.id = c.patient_id").
		Joins("LEFT JOIN partner_institutions pi ON pi.id = p.institution_id").
		Joins("JOIN dentists d ON d.id = c.dentist_id").
		Where("c.id = ?", id).
		Limit(1).
		Scan(&row).Error
	if err != nil || row.ID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Checkup not found"})
		return
	}

	var entries []entryRow
	if err := config.DB.
		Table("odontogram_entries oe").
		Select(`
			oe.id,
			oe.tooth_number,
			COALESCE(oe.tooth_surface, '') AS tooth_surface,
			oe.condition_id,
			COALESCE(dc.name, '') AS condition_name,
			COALESCE(dc.color_code, '') AS color_code,
			COALESCE(oe.notes, '') AS notes
		`).
		Joins("LEFT JOIN dental_conditions dc ON dc.id = oe.condition_id").
		Where("oe.checkup_id = ?", id).
		Order("oe.tooth_number ASC, oe.created_at ASC").
		Scan(&entries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch odontogram entries"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":            row.ID,
		"patient_id":    row.PatientID,
		"patient_name":  row.PatientName,
		"institution":   row.Institution,
		"dentist_id":    row.DentistID,
		"dentist_name":  row.DentistName,
		"checkup_date":  row.CheckupDate.Format("2006-01-02"),
		"general_notes": row.GeneralNotes,
		"status":        normalizeStatus(row.Status),
		"created_at":    row.CreatedAt,
		"entries":       entries,
	})
}

func CreateCheckup(c *gin.Context) {
	var req createCheckupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	req.PatientID = strings.TrimSpace(req.PatientID)
	req.DentistID = strings.TrimSpace(req.DentistID)
	req.CheckupDate = strings.TrimSpace(req.CheckupDate)
	req.GeneralNotes = strings.TrimSpace(req.GeneralNotes)
	req.Status = parseStatusForDB(req.Status)

	if req.PatientID == "" || req.DentistID == "" || req.CheckupDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient_id, dentist_id, and checkup_date are required"})
		return
	}
	if !isValidDateYYYYMMDD(req.CheckupDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "checkup_date must be in YYYY-MM-DD format"})
		return
	}
	if err := validateEntryInputs(req.Entries); err != nil {
		if mapBadRequest(c, err) {
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid entries"})
		return
	}

	ok, err := recordExists("patients", req.PatientID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate patient"})
		return
	}
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Patient not found"})
		return
	}

	ok, err = recordExists("dentists", req.DentistID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate dentist"})
		return
	}
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dentist not found"})
		return
	}

	tx := config.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	insertCheckupQuery := `
		INSERT INTO checkups
			(id, patient_id, dentist_id, checkup_date, general_notes, status)
		VALUES
			(UUID(), ?, ?, ?, NULLIF(?, ''), ?)
	`
	if err := tx.Exec(insertCheckupQuery, req.PatientID, req.DentistID, req.CheckupDate, req.GeneralNotes, req.Status).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create checkup"})
		return
	}

	var checkupID string
	if err := tx.
		Table("checkups").
		Select("id").
		Where("patient_id = ? AND dentist_id = ? AND checkup_date = ?", req.PatientID, req.DentistID, req.CheckupDate).
		Order("created_at DESC").
		Limit(1).
		Scan(&checkupID).Error; err != nil || strings.TrimSpace(checkupID) == "" {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve created checkup"})
		return
	}

	for _, e := range req.Entries {
		conditionID := strings.TrimSpace(e.ConditionID)
		surface := strings.TrimSpace(e.ToothSurface)
		notes := strings.TrimSpace(e.Notes)

		ok, err := recordExists("dental_conditions", conditionID)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate dental condition"})
			return
		}
		if !ok {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "condition_id not found: " + conditionID})
			return
		}

		insertEntryQuery := `
			INSERT INTO odontogram_entries
				(id, checkup_id, tooth_number, tooth_surface, condition_id, notes)
			VALUES
				(UUID(), ?, ?, NULLIF(?, ''), ?, NULLIF(?, ''))
		`
		if err := tx.Exec(insertEntryQuery, checkupID, e.ToothNumber, surface, conditionID, notes).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create odontogram entries"})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Checkup created",
		"checkup_id": checkupID,
	})
}

func UpdateCheckup(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid checkup id"})
		return
	}

	var req updateCheckupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	req.PatientID = strings.TrimSpace(req.PatientID)
	req.DentistID = strings.TrimSpace(req.DentistID)
	req.CheckupDate = strings.TrimSpace(req.CheckupDate)
	req.GeneralNotes = strings.TrimSpace(req.GeneralNotes)
	if strings.TrimSpace(req.Status) != "" {
		req.Status = parseStatusForDB(req.Status)
	}
	if err := validateEntryInputs(req.Entries); err != nil {
		if mapBadRequest(c, err) {
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid entries"})
		return
	}

	exists, err := recordExists("checkups", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check checkup"})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Checkup not found"})
		return
	}

	if req.PatientID != "" {
		ok, err := recordExists("patients", req.PatientID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate patient"})
			return
		}
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Patient not found"})
			return
		}
	}

	if req.DentistID != "" {
		ok, err := recordExists("dentists", req.DentistID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate dentist"})
			return
		}
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dentist not found"})
			return
		}
	}

	if req.CheckupDate != "" && !isValidDateYYYYMMDD(req.CheckupDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "checkup_date must be in YYYY-MM-DD format"})
		return
	}

	updates := map[string]any{}
	if req.PatientID != "" {
		updates["patient_id"] = req.PatientID
	}
	if req.DentistID != "" {
		updates["dentist_id"] = req.DentistID
	}
	if req.CheckupDate != "" {
		updates["checkup_date"] = req.CheckupDate
	}
	if req.GeneralNotes != "" {
		updates["general_notes"] = req.GeneralNotes
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}

	tx := config.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	if len(updates) > 0 {
		if err := tx.Table("checkups").Where("id = ?", id).Updates(updates).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update checkup"})
			return
		}
	}

	if req.ReplaceEntries {
		if err := tx.Table("odontogram_entries").Where("checkup_id = ?", id).Delete(nil).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to replace odontogram entries"})
			return
		}
		for _, e := range req.Entries {
			conditionID := strings.TrimSpace(e.ConditionID)
			surface := strings.TrimSpace(e.ToothSurface)
			notes := strings.TrimSpace(e.Notes)

			ok, err := recordExists("dental_conditions", conditionID)
			if err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate dental condition"})
				return
			}
			if !ok {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "condition_id not found: " + conditionID})
				return
			}

			insertEntryQuery := `
				INSERT INTO odontogram_entries
					(id, checkup_id, tooth_number, tooth_surface, condition_id, notes)
				VALUES
					(UUID(), ?, ?, NULLIF(?, ''), ?, NULLIF(?, ''))
			`
			if err := tx.Exec(insertEntryQuery, id, e.ToothNumber, surface, conditionID, notes).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create odontogram entries"})
				return
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Checkup updated",
		"checkup_id": id,
	})
}
