package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"backend/database"
	"backend/handlers"
	"backend/middleware" // Importando o nosso middleware de proteção JWT
	"github.com/joho/godotenv"
)

// Middleware básico de CORS flexível
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Pega a origem de quem está fazendo a requisição (Vite)
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
		
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Rota de teste para garantirmos que o servidor está vivo
func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"status": "ok", "message": "API da Malu rodando perfeitamente!"}`)
}

func main() {
	// 1. Carregar as variáveis do arquivo .env
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: Arquivo .env não encontrado, usando variáveis de ambiente do sistema.")
	}

	// 2. Iniciar a conexão isolada com o MongoDB
	database.Connect()

	// 3. Registrando nossas rotas
	http.HandleFunc("/api/ping", enableCORS(pingHandler))
	
	// Rotas de Autenticação
	http.HandleFunc("/api/setup", enableCORS(handlers.SetupHandler))
	http.HandleFunc("/api/login", enableCORS(handlers.LoginHandler))
	// Nova rota de configuração (protegida):
	http.HandleFunc("/api/settings/update", enableCORS(middleware.JWTMiddleware(handlers.UpdateCredentialsHandler)))
	// Rotas do Blog (Posts)
    http.HandleFunc("/api/posts/create", enableCORS(middleware.JWTMiddleware(handlers.CreatePostHandler)))
    http.HandleFunc("/api/posts", enableCORS(handlers.GetPostsHandler))
    http.HandleFunc("/api/posts/", enableCORS(middleware.JWTMiddleware(handlers.ManagePostHandler))) // Nova rota para Edição (PUT) e Remoção (DELETE)

    // Rotas da Vitrine (Produtos)
    http.HandleFunc("/api/products/create", enableCORS(middleware.JWTMiddleware(handlers.CreateProductHandler)))
    http.HandleFunc("/api/products", enableCORS(handlers.GetProductsHandler))
    http.HandleFunc("/api/products/", enableCORS(middleware.JWTMiddleware(handlers.ManageProductHandler))) // Nova rota para Edição (PUT) e Remoção (DELETE)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Servidor Golang iniciado na porta %s...", port)
	
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Erro ao iniciar servidor: %v", err)
	}
}