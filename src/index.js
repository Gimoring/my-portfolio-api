const express = require('express');
const portfolioRouter = require('./routers/portfolios');
const mongoose = require('mongoose');
const config = require('./config/dev');

class Server {
	constructor() {
		const app = express();
		this.app = app;
		this.port = process.env.PORT || 3001;
	}

	setRoute() {
		this.app.use('/api/v1',portfolioRouter);
	}

	async connectDB() {
		try {
			await mongoose.connect(config.DB_URI,{
				useNewUrlParser: true, 
				useUnifiedTopology: true, // 최신 몽고 DB 연결관리 엔진 쓰기
			});
			console.log('Connected to DB');
		} catch (err) {
			console.log('Failed To connect to DB', err);
		}
	}

	setMiddleware() {
		//* json middleware 익스프레스가 json 객체를 읽을 수 있도록 해줌
		this.app.use(express.json());

		this.setRoute();	
	}

	listen() {
		this.connectDB();
		this.setMiddleware();
		this.app.listen(this.port, (err) => {
			if(err) console.error(err);
			console.log(`Server is on port ${this.port}`);
		});
	}
}

function init() {
	const server = new Server();
	server.listen();
}

init();
