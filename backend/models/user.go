package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User representa a conta administrativa (Malu) no MongoDB
type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"` // O "-" impede que a senha vaze no JSON
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}