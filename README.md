# 📞 Call-Now

A **real-time random chat app** built using **Turborepo, Express, and Socket.io**. This application allows users to connect and chat with strangers instantly.  

## 🚀 Features  

- **Real-time communication** with Socket.io  
- **Scalable monorepo structure** using Turborepo  
- **Backend powered by Express.js**  
- **Docker support** for seamless deployment  

---

## 🔧 Installation & Setup  

### 📥 Clone the Repository  

```sh
git clone https://github.com/your-username/call-now.git
cd call-now
```
### 📦 Install Dependencies
```
npm install
```
### ▶️ Run the App Locally
```
npm run dev
```


## 🐳 Run with Docker

### 🔨 Build Docker Image
```
docker build -t call-now \
  --build-arg NEXT_PUBLIC_BACKEND=https://api.hearme.life/ \
  --build-arg PORT=5000 .

```
### 🚀 Run Docker Container

```
sudo docker run -d -p 5000:5000 -p 3000:3000  call-now
```

