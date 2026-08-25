# MyNotes

Кратко: приложение заметок (backend на Python/FastAPI, frontend на React), контейнеры в GHCR, деплой через Helm + Argo CD. Репозиторий приватный.

## Структура
- backend/ — FastAPI приложение, Dockerfile, migrations
- frontend/ — React SPA, Dockerfile
- infra/helm/my-notes — Helm chart
- infra/argocd — Argo CD манифесты
- .github/workflows/build-and-push.yaml — CI: сборка и пуш образов в GHCR

## Требования
- git
- Docker / docker-compose (локально)
- kubectl + доступ к кластеру
- argocd CLI (рекомендовано)
- GitHub PAT (для приватного репо) или SSH-ключ (для Argo CD)
- GitHub Actions использует GHCR (GITHUB_TOKEN)

## Локальная разработка
1. Backend:
   - Создать виртуальное окружение, установить зависимости:
     - python -m venv .venv && source .venv/bin/activate
     - pip install -r backend/requirements.txt
   - Запуск: в backend/ запустить uvicorn app.main:app --reload

2. Frontend:
   - cd frontend && npm install && npm start

3. docker-compose (dev):
   - docker-compose up --build

## CI/CD
- Workflow: .github/workflows/build-and-push.yaml
  - Сборка backend/frontend образов, пуш в ghcr.io/${{ github.repository_owner }}/...
  - Обновление тега в infra/helm/my-notes/values*.yaml и push

## Argo CD (приватный репо) — быстрый чеклист
1. Установить Argo CD в кластер (если ещё нет):
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

2. Логин в argocd CLI:
   kubectl -n argocd port-forward svc/argocd-server 8080:443 &>/dev/null &
   ARGO_PWD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
   argocd login --insecure --username admin --password "$ARGO_PWD" localhost:8080

3. Добавить приватный репозиторий:
   # HTTPS + PAT
   argocd repo add https://github.com/<user>/MyNotes.git --username <github-user> --password <PAT> --name mynotes-repo
   # или SSH
   argocd repo add git@github.com:<user>/MyNotes.git --ssh-private-key-path ~/.ssh/id_rsa --name mynotes-ssh

4. Применить Application-манифест:
   kubectl apply -f infra/argocd/app-prod.yaml
   (путь к chart в манифесте: infra/helm/my-notes, targetRevision: main/HEAD)

5. (Опционально) Image pull secret для приватного GHCR:
   kubectl create secret docker-registry ghcr-creds \
     --docker-server=ghcr.io --docker-username=<user> --docker-password=<PAT> -n my-notes-prod
   и подключить в values.yaml imagePullSecrets.

## Полезные команды
- Проверить ветки удалённого репо:
  git ls-remote --heads https://github.com/<user>/MyNotes.git
- Сменить targetRevision в манифесте:
  sed -i 's/targetRevision: main/targetRevision: HEAD/' infra/argocd/app-prod.yaml
- Посмотреть статус Argo App:
  kubectl -n argocd get applications.argoproj.io my-notes-prod -o wide

## Примечания
- CI автоматически изменяет теги в Helm values; в Argo CD включите автоматический sync для self-heal/prune (см. infra/argocd).
- Храните PAT/секреты в безопасном месте (GitHub Secrets / Kubernetes Secrets).