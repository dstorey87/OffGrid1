# Makefile for OffGrid Platform

.PHONY: help build up down logs clean test lint format

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

restart: down up ## Restart all services

# Frontend targets
frontend-install: ## Install frontend dependencies
	cd frontend && npm install

frontend-dev: ## Run frontend in development mode
	cd frontend && npm run dev

frontend-build: ## Build frontend for production
	cd frontend && npm run build

frontend-test: ## Run frontend tests
	cd frontend && npm test

frontend-lint: ## Lint frontend code
	cd frontend && npm run lint

frontend-format: ## Format frontend code
	cd frontend && npm run format

# AI Service targets
ai-install: ## Install AI service dependencies
	cd ai-service && pip install -r requirements.txt

ai-dev: ## Run AI service in development mode
	cd ai-service && uvicorn main:app --reload

ai-test: ## Run AI service tests
	cd ai-service && pytest

ai-lint: ## Lint AI service code
	cd ai-service && ruff . && mypy .

ai-format: ## Format AI service code
	cd ai-service && black .

# Kubernetes targets
k8s-deploy: ## Deploy to Kubernetes
	kubectl apply -f k8s/

k8s-delete: ## Delete from Kubernetes
	kubectl delete -f k8s/

k8s-status: ## Check Kubernetes deployment status
	kubectl get all -n offgrid

k8s-logs: ## View Kubernetes logs
	kubectl logs -n offgrid -l app=frontend --tail=100

# Combined targets
test: frontend-test ai-test ## Run all tests

lint: frontend-lint ai-lint ## Run all linters

format: frontend-format ai-format ## Format all code

dev: ## Start development environment
	@echo "Starting development environment..."
	@make up
	@echo "Services started. Access at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  WordPress: http://localhost:8080"
	@echo "  AI Service: http://localhost:8000"
