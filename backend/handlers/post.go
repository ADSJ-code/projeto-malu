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

// CreatePostHandler recebe um novo artigo do CMS e guarda no MongoDB Atlas
func CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var post models.Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		http.Error(w, "Dados de requisição inválidos", http.StatusBadRequest)
		return
	}

	post.ID = primitive.NewObjectID()
	post.CreatedAt = time.Now()
	post.UpdatedAt = time.Now()

	if post.Status == "" {
		post.Status = "published"
	}

	collection := database.DB.Collection("posts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, post)
	if err != nil {
		http.Error(w, "Erro ao guardar o artigo no banco de dados", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Artigo publicado com sucesso!",
		"id":      post.ID.Hex(),
	})
}

// GetPostsHandler lista todos os artigos
func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	collection := database.DB.Collection("posts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Erro ao procurar artigos", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	posts := make([]models.Post, 0)
	if err := cursor.All(ctx, &posts); err != nil {
		http.Error(w, "Erro ao processar os artigos extraídos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

// ManagePostHandler lida com a Edição (PUT) e Remoção (DELETE) de um artigo específico
func ManagePostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extrair o ID do URL (ex: /api/posts/60d5ec49f...)
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 || parts[3] == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID do artigo não fornecido na URL"})
		return
	}
	
	postID := parts[3]
	objID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID de artigo inválido"})
		return
	}

	collection := database.DB.Collection("posts")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodPut:
		var updateData models.Post
		if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Dados inválidos"})
			return
		}

		update := bson.M{
			"$set": bson.M{
				"title":      updateData.Title,
				"category":   updateData.Category,
				"summary":    updateData.Summary,
				"content":    updateData.Content,
				"image_url":  updateData.ImageURL,
				"slug":       updateData.Slug,
				"updated_at": time.Now(),
			},
		}

		result, err := collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Erro ao atualizar o artigo"})
			return
		}

		if result.MatchedCount == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Artigo não encontrado"})
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Artigo atualizado com sucesso!"})

	case http.MethodDelete:
		result, err := collection.DeleteOne(ctx, bson.M{"_id": objID})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Erro ao deletar o artigo"})
			return
		}

		if result.DeletedCount == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "Artigo não encontrado"})
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Artigo removido com sucesso!"})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método não permitido"})
	}
}