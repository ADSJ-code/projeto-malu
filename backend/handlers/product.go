package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"backend/database"
	"backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateProductHandler recebe um novo produto da Vitrine/Garagem e guarda no MongoDB
func CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var product models.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Dados de requisição inválidos", http.StatusBadRequest)
		return
	}

	// Forçar a geração de dados nativos de auditoria e ID
	product.ID = primitive.NewObjectID()
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()

	// Se não enviar status, assume "disponivel" por padrão
	if product.Status == "" {
		product.Status = "disponivel"
	}

	collection := database.DB.Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, product)
	if err != nil {
		http.Error(w, "Erro ao guardar o produto no banco de dados", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Produto adicionado à vitrine com sucesso!",
		"id":      product.ID.Hex(),
	})
}

// GetProductsHandler lista todos os produtos para a página da Vitrine
func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	collection := database.DB.Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Procura todos os produtos cadastrados
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Erro ao procurar produtos", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	products := make([]models.Product, 0)
	if err := cursor.All(ctx, &products); err != nil {
		http.Error(w, "Erro ao processar os produtos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}