package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Product representa a estrutura estrita de um item da Vitrine no MongoDB
type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	Price       float64            `bson:"price" json:"price"`
	ImageURL    string             `bson:"image_url" json:"image_url"`
	Category    string             `bson:"category" json:"category"` // "garagem" ou "diversos"
	Status      string             `bson:"status" json:"status"`     // "disponivel" ou "vendido"
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}