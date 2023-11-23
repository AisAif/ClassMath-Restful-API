import express from "express"
import { adminMiddleware } from "../middleware/admin-middleware.js"
import upload from '../utils/upload-file.js'
import gradeController from "../controller/grade-controller.js"
import tutorialController from "../controller/tutorial-controller.js"
import quizController from "../controller/quiz-controller.js"
import questionController from "../controller/question-controller.js"
import quizHistoryController from "../controller/quiz-history-controller.js"

const adminRouter = express.Router()

adminRouter.use(adminMiddleware)
adminRouter.use(upload)

// Grade API
adminRouter.post("/api/grades", gradeController.create)
adminRouter.patch("/api/grades/:idGrade", gradeController.update)
adminRouter.delete("/api/grades/:idGrade", gradeController.remove)

// Tutorial API
adminRouter.post("/api/grades/:idGrade/tutorials", tutorialController.create)
adminRouter.patch("/api/grades/:idGrade/tutorials/:idTutorial", tutorialController.update)
adminRouter.delete("/api/grades/:idGrade/tutorials/:idTutorial", tutorialController.remove)

// Quiz API
adminRouter.post("/api/grades/:idGrade/tutorials/:idTutorial/quizzes", quizController.create)
adminRouter.patch("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/:idQuiz", quizController.update)
adminRouter.delete("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/:idQuiz", quizController.remove)

// Question API
adminRouter.post("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/:idQuiz/questions", questionController.create)
adminRouter.patch("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/:idQuiz/questions/:idQuestion", questionController.update)
adminRouter.delete("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/:idQuiz/questions/:idQuestion", questionController.remove)

// Quiz History API
adminRouter.get("/api/quiz-histories/", quizHistoryController.getAll)
adminRouter.delete("/api/quiz-histories/:idQuizHistory", quizHistoryController.remove)

export {
    adminRouter
}