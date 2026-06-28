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

	// Forçar a geração de dados nativos de auditoria e ID do MongoDB
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
		"message": "Artigo publicado com sucesso diretamente na nuvem!",
		"id":      post.ID.Hex(),
	})
}

// GetPostsHandler lista todos os artigos para a página pública e para o painel
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