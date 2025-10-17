# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the OffGrid platform to a staging/production environment.

## 📁 Architecture Overview

The deployment mirrors the `docker-compose.yml` configuration with the following services:

- **Frontend** (Next.js) - 2 replicas
- **AI Service** (FastAPI) - 2 replicas
- **WordPress** - 1 replica (with multisite)
- **MySQL** - 1 replica (stateful)
- **Redis** - 1 replica (stateful)
- **Ingress** - NGINX ingress controller

## 🚀 Prerequisites

1. **Kubernetes Cluster** (v1.24+)

   - Minikube (local testing)
   - GKE, EKS, AKS (cloud providers)
   - Self-hosted cluster

2. **kubectl** installed and configured

   ```bash
   kubectl version --client
   ```

3. **NGINX Ingress Controller** installed

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
   ```

4. **Cert-Manager** (optional, for TLS)

   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
   ```

5. **Docker Images Built**

   ```bash
   # Build frontend
   cd frontend
   docker build -t offgrid/frontend:latest --target production .

   # Build AI service
   cd ../ai-service
   docker build -t offgrid/ai-service:latest .

   # Tag and push to your registry
   docker tag offgrid/frontend:latest your-registry/offgrid/frontend:latest
   docker tag offgrid/ai-service:latest your-registry/offgrid/ai-service:latest
   docker push your-registry/offgrid/frontend:latest
   docker push your-registry/offgrid/ai-service:latest
   ```

## 📦 Deployment Steps

### 1. Apply All Manifests

Using `kubectl`:

```bash
# Create namespace first
kubectl apply -f namespace.yaml

# Deploy in order
kubectl apply -f mysql.yaml
kubectl apply -f redis.yaml
kubectl apply -f wordpress.yaml
kubectl apply -f ai-service.yaml
kubectl apply -f frontend.yaml
kubectl apply -f ingress.yaml
```

Or using `kustomize`:

```bash
kubectl apply -k .
```

### 2. Verify Deployments

```bash
# Check all resources in namespace
kubectl get all -n offgrid

# Check pod status
kubectl get pods -n offgrid

# Check services
kubectl get svc -n offgrid

# Check ingress
kubectl get ingress -n offgrid
```

### 3. Wait for Pods to be Ready

```bash
kubectl wait --for=condition=ready pod -l app=mysql -n offgrid --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n offgrid --timeout=300s
kubectl wait --for=condition=ready pod -l app=wordpress -n offgrid --timeout=300s
kubectl wait --for=condition=ready pod -l app=ai-service -n offgrid --timeout=300s
kubectl wait --for=condition=ready pod -l app=frontend -n offgrid --timeout=300s
```

### 4. Access the Application

```bash
# Get ingress IP
kubectl get ingress offgrid-ingress -n offgrid

# Port forward for local testing
kubectl port-forward -n offgrid svc/frontend 3000:3000
kubectl port-forward -n offgrid svc/ai-service 8000:8000
kubectl port-forward -n offgrid svc/wordpress 8080:80
```

Visit: `http://localhost:3000`

## 🔧 Configuration

### Update Secrets

**Production: DO NOT use default passwords!**

```bash
# MySQL secrets
kubectl create secret generic mysql-secret -n offgrid \
  --from-literal=root-password='YOUR_STRONG_PASSWORD' \
  --from-literal=database='wordpress' \
  --from-literal=username='wpuser' \
  --from-literal=password='YOUR_DB_PASSWORD' \
  --dry-run=client -o yaml | kubectl apply -f -

# WordPress secrets
kubectl create secret generic wordpress-secret -n offgrid \
  --from-literal=admin-user='admin' \
  --from-literal=admin-password='YOUR_ADMIN_PASSWORD' \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Update ConfigMaps

```bash
# Frontend config
kubectl edit configmap frontend-config -n offgrid

# AI Service config
kubectl edit configmap ai-service-config -n offgrid
```

### Update Ingress Hostname

Edit `ingress.yaml`:

```yaml
spec:
  rules:
    - host: your-domain.com # Change this
```

## 📊 Monitoring

### View Logs

```bash
# Frontend logs
kubectl logs -f -n offgrid -l app=frontend

# AI Service logs
kubectl logs -f -n offgrid -l app=ai-service

# WordPress logs
kubectl logs -f -n offgrid -l app=wordpress

# MySQL logs
kubectl logs -f -n offgrid -l app=mysql
```

### Check Health

```bash
# Frontend health
kubectl exec -it -n offgrid deploy/frontend -- curl localhost:3000/api/health

# AI Service health
kubectl exec -it -n offgrid deploy/ai-service -- curl localhost:8000/health

# WordPress health
kubectl exec -it -n offgrid deploy/wordpress -- curl localhost/wp-json/
```

## 🔄 Updates and Rollbacks

### Update Deployment

```bash
# Update image
kubectl set image deployment/frontend frontend=offgrid/frontend:v2.0.0 -n offgrid

# Or edit directly
kubectl edit deployment frontend -n offgrid
```

### Rollback

```bash
# View rollout history
kubectl rollout history deployment/frontend -n offgrid

# Rollback to previous version
kubectl rollout undo deployment/frontend -n offgrid

# Rollback to specific revision
kubectl rollout undo deployment/frontend --to-revision=2 -n offgrid
```

### Scale Deployments

```bash
# Scale frontend
kubectl scale deployment/frontend --replicas=3 -n offgrid

# Scale AI service
kubectl scale deployment/ai-service --replicas=3 -n offgrid
```

## 🗄️ Persistent Storage

The following PVCs are created:

- `mysql-pvc` - 10Gi - MySQL database
- `wordpress-pvc` - 20Gi - WordPress files
- `redis-pvc` - 1Gi - Redis cache

### Backup Data

```bash
# MySQL backup
kubectl exec -n offgrid deploy/mysql -- mysqldump -u root -p wordpress > backup.sql

# WordPress files backup
kubectl cp offgrid/wordpress-pod:/var/www/html ./wordpress-backup
```

## 🔒 Security Considerations

1. **Update all default passwords** in secrets
2. **Enable TLS** via cert-manager and Let's Encrypt
3. **Configure network policies** to restrict pod communication
4. **Use RBAC** for access control
5. **Scan images** for vulnerabilities before deployment
6. **Enable pod security policies**
7. **Limit resource requests/limits** appropriately

## 🧪 Testing in Staging

```bash
# Port forward to test locally
kubectl port-forward -n offgrid svc/frontend 3001:3000 &
kubectl port-forward -n offgrid svc/ai-service 8001:8000 &
kubectl port-forward -n offgrid svc/wordpress 8080:80 &

# Run Playwright tests against staging
cd frontend
npx playwright test
```

## 🗑️ Cleanup

```bash
# Delete all resources
kubectl delete -k .

# Or delete namespace (removes everything)
kubectl delete namespace offgrid
```

## 📝 Resource Limits

| Service    | CPU Request | CPU Limit | Memory Request | Memory Limit |
| ---------- | ----------- | --------- | -------------- | ------------ |
| Frontend   | 200m        | 1000m     | 256Mi          | 512Mi        |
| AI Service | 200m        | 1000m     | 256Mi          | 512Mi        |
| WordPress  | 100m        | 500m      | 256Mi          | 512Mi        |
| MySQL      | 100m        | 500m      | 256Mi          | 512Mi        |
| Redis      | 50m         | 200m      | 64Mi           | 128Mi        |

Adjust based on your workload and monitoring data.

## 🔗 Useful Commands

```bash
# Describe a pod
kubectl describe pod <pod-name> -n offgrid

# Get events
kubectl get events -n offgrid --sort-by='.lastTimestamp'

# Shell into a pod
kubectl exec -it -n offgrid deploy/frontend -- /bin/sh

# View resource usage
kubectl top pods -n offgrid
kubectl top nodes

# Get all resources
kubectl api-resources --namespaced=true
```

## 📚 Further Reading

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager](https://cert-manager.io/docs/)
- [Kustomize](https://kustomize.io/)
