package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Post representa a estrutura estrita de um artigo de blog no MongoDB
type Post struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string             `bson:"title" json:"title"`
	Category  string             `bson:"category" json:"category"`
	Summary   string             `bson:"summary" json:"summary"`
	Content   string             `bson:"content" json:"content"`
	ImageURL  string             `bson:"image_url" json:"image_url"`
	Slug      string             `bson:"slug" json:"slug"`
	Status    string             `bson:"status" json:"status"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}