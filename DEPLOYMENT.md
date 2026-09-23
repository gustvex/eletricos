# Guia de Deploy

Este guia descreve como fazer deploy da aplicação em um VPS com domínio próprio.

## Pré-requisitos

- **VPS** com acesso SSH
- **Domínio próprio** apontando para o IP do VPS
- **Docker** instalado no VPS
- **Docker Compose** (opcional, mas recomendado)
- **Nginx** como reverse proxy
- **Certificado SSL** (Let's Encrypt - grátis)

## Passo 1: Configurar o Servidor (VPS)

### 1.1 Instalar dependências

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar seu usuário ao grupo docker (opcional, evita sudo)
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Nginx
sudo apt install nginx -y

# Instalar Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
```

### 1.2 Preparar diretórios

```bash
# Criar diretório para a aplicação
mkdir -p ~/app/eletricos
cd ~/app/eletricos

# Criar diretório para dados de leads
mkdir -p data
chmod 755 data
```

## Passo 2: Clonar e Configurar a Aplicação

```bash
# Clonar o repositório
git clone https://github.com/gustvex/eletricos.git .

# Configurar variáveis de ambiente
cat > .env << EOF
NODE_ENV=production
CORS_ORIGINS=https://seu-dominio.com.br
LEADS_FILE=/data/leads.jsonl
EOF
```

### Editar configuração do negócio

Editar `shared/src/business.js` para:
1. **Trocar o número do WhatsApp** para o do Guilherme:
   ```js
   whatsapp: {
     phone: '5565999901389',   // seu número aqui
     display: '(65) 9999-1389', // formato de exibição
     tel: '+5565999901389',
   },
   ```

2. **Configurar a URL do site**:
   ```js
   siteUrl: 'https://seu-dominio.com.br'
   ```

## Passo 3: Build da Imagem Docker

```bash
# Fazer o build da imagem
docker build -t eletricos:latest .

# Ou usar Docker Compose (veja seção abaixo)
```

## Passo 4: Configurar Nginx como Reverse Proxy

### 4.1 Criar arquivo de configuração do Nginx

```bash
sudo nano /etc/nginx/sites-available/seu-dominio.com.br
```

Adicionar o seguinte conteúdo:

```nginx
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com.br;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - aplicação
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com.br;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;
    
    # Configurações SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy para a aplicação Node
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 4.2 Ativar o site no Nginx

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/seu-dominio.com.br /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

## Passo 5: Obter Certificado SSL com Let's Encrypt

```bash
# Solicitar certificado
sudo certbot certonly --standalone -d seu-dominio.com.br

# Ou com o plugin Nginx (automático)
sudo certbot --nginx -d seu-dominio.com.br

# Renovação automática (já vem configurada)
sudo systemctl enable certbot.timer
```

## Passo 6: Executar a Aplicação

### Opção A: Docker diretamente

```bash
docker run -d \
  --name eletricos \
  --restart always \
  -p 3000:3000 \
  -v /home/user/app/eletricos/data:/data \
  -e CORS_ORIGINS=https://seu-dominio.com.br \
  -e LEADS_FILE=/data/leads.jsonl \
  -e NODE_ENV=production \
  eletricos:latest
```

### Opção B: Docker Compose (recomendado)

Criar `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    container_name: eletricos
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      NODE_ENV: production
      CORS_ORIGINS: https://seu-dominio.com.br
      LEADS_FILE: /data/leads.jsonl
```

Executar:

```bash
docker-compose up -d
```

## Passo 7: Monitorar a Aplicação

```bash
# Ver logs da aplicação
docker logs eletricos -f

# Ver status do container
docker ps

# Ver uso de recursos
docker stats

# Reiniciar se necessário
docker restart eletricos
```

## Manutenção

### Atualizar aplicação

```bash
# Clonar alterações
git pull origin main

# Rebuild da imagem
docker build -t eletricos:latest .

# Parar e remover container antigo
docker stop eletricos
docker rm eletricos

# Rodar novo container
docker-compose up -d
# ou
docker run -d --name eletricos ... eletricos:latest
```

### Renovar certificado SSL

```bash
# Renovação manual
sudo certbot renew

# Renovação automática (já está ativa)
sudo systemctl status certbot.timer
```

### Acessar dados de leads

```bash
# Arquivo de leads
cat data/leads.jsonl

# Ou dentro do container
docker exec eletricos cat /data/leads.jsonl
```

## Troubleshooting

### Nginx retorna 502 Bad Gateway

- Verificar se a aplicação está rodando: `docker ps`
- Ver logs: `docker logs eletricos`
- Verificar se porta 3000 está sendo usada: `sudo lsof -i :3000`

### Certificado SSL não funciona

```bash
# Verificar certificado
sudo certbot certificates

# Renovar
sudo certbot renew --force-renewal
```

### Dados de leads não estão sendo salvos

- Verificar permissões: `ls -la data/`
- Verificar se volume está montado: `docker inspect eletricos | grep Mounts`
- Ver logs: `docker logs eletricos | grep leads`

### CORS errors no navegador

- Confirmar que `CORS_ORIGINS` está correto em `docker-compose.yml` ou `.env`
- Deve começar com `https://` (em produção)

## Checklist de Deploy

- [ ] VPS criado e acessível via SSH
- [ ] Domínio apontando para IP do VPS
- [ ] Docker e dependências instaladas
- [ ] Número do WhatsApp atualizado em `shared/src/business.js`
- [ ] URL do site atualizada em `shared/src/business.js`
- [ ] Imagem Docker buildada
- [ ] Nginx configurado como reverse proxy
- [ ] Certificado SSL obtido com Let's Encrypt
- [ ] Container Docker rodando e acessível
- [ ] Teste de envio de formulário (orçamento → WhatsApp)
- [ ] Verificar dados de leads em `data/leads.jsonl`
- [ ] Configurar renovação automática do certificado SSL

## URLs úteis

- **Let's Encrypt**: https://letsencrypt.org/
- **Docker Hub**: https://hub.docker.com/
- **Nginx**: https://nginx.org/
- **Certbot**: https://certbot.eff.org/

---

**Dúvidas?** Entre em contato ou abra uma issue no repositório.
