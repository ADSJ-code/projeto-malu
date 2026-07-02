package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"backend/database"
	"backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateProductHandler recebe um novo produto do CMS e guarda no MongoDB Atlas
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

	product.ID = primitive.NewObjectID()

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
		"message": "Produto adicionado com sucesso!",
		"id":      product.ID.Hex(),
	})
}

// GetProductsHandler lista todos os produtos para a vitrine e para o painel
func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	collection := database.DB.Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Erro ao procurar produtos", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	products := make([]models.Product, 0)
	if err := cursor.All(ctx, &products); err != nil {
		http.Error(w, "Erro ao processar os produtos extraídos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// ManageProductHandler lida com a Edição (PUT) e Remoção (DELETE) de um produto específico
func ManageProductHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extrair o ID do URL (ex: /api/products/60d5ec49f...)
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 || parts[3] == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID do produto não fornecido na URL"})
		return
	}
	
	productID := parts[3]
	objID, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID de produto inválido"})
		return
	}

	collection := database.DB.Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodPut:
		var updateData models.Product
		if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Dados inválidos"})
			return
		}

		update := bson.M{
			"$set": bson.M{
				"name":        updateData.Name,
				"description": updateData.Description,
				"price":       updateData.Price,
				"image_url":   updateData.ImageURL,
				"category":    updateData.Category,
				"status":      updateData.Status,
			},
		}

		result, err := collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Erro ao atualizar o produto"})
			return
		}

		if result.MatchedCount == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Produto não encontrado"})
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Produto atualizado com sucesso!"})

	case http.MethodDelete:
		result, err := collection.DeleteOne(ctx, bson.M{"_id": objID})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Erro ao deletar o produto"})
			return
		}

		if result.DeletedCount == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Produto não encontrado"})
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Produto removido com sucesso!"})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método não permitido"})
	}
}