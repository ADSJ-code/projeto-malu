package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"backend/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Estrutura exata dos textos da Home
type HomeContent struct {
	HeroTitle   string `json:"heroTitle" bson:"heroTitle"`
	HeroText    string `json:"heroText" bson:"heroText"`
	BioTitle    string `json:"bioTitle" bson:"bioTitle"`
	BioText     string `json:"bioText" bson:"bioText"`
}

// GET /api/content/home (Pública)
func GetHomeContentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	collection := database.DB.Collection("site_settings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var content HomeContent
	// Buscamos um documento com um ID fixo para garantir que será sempre apenas 1 linha
	err := collection.FindOne(ctx, bson.M{"_id": "home_page_texts"}).Decode(&content)
	if err != nil {
		// Se não encontrar nada no banco (primeira vez), enviamos textos vazios ou padrão
		json.NewEncoder(w).Encode(HomeContent{})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(content)
}

// PUT /api/content/home (Protegida)
func UpdateHomeContentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var newContent HomeContent
	if err := json.NewDecoder(r.Body).Decode(&newContent); err != nil {
		http.Error(w, "Erro ao ler os dados", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("site_settings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Filtro com ID fixo e Update com Upsert (cria se não existir, atualiza se já existir)
	filter := bson.M{"_id": "home_page_texts"}
	update := bson.M{"$set": newContent}
	opts := options.Update().SetUpsert(true)

	_, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		http.Error(w, "Erro ao salvar no banco", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Conteúdo da Home atualizado com sucesso!"})
}