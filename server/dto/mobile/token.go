package mobile

type TokenPayload struct {
	ExpoToken string `json:"expo_token"`
}

type SendNotificationPayload struct {
	ToExpoToken string `json:"to"`
	Title       string `json:"title"`
	Body        string `json:"body"`
	UserID      string `json:"user_id"`
}

type UpdateExpoTokenPayload struct {
	ExpoToken string `json:"expo_token"`
	UserID    uint   `json:"user_id"`
	UserType  string `json:"user_type"`
}

