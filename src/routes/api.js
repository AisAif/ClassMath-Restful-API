import express from "express"
import { authMiddleware } from "../middleware/auth-middleware.js"
import userController from "../controller/user-controller.js"
import gradeController from "../controller/grade-controller.js"
import tutorialController from "../controller/tutorial-controller.js"
import quizController from "../controller/quiz-controller.js"
import quizHistoryController from "../controller/quiz-history-controller.js"

const userRouter = new express.Router()

userRouter.use(authMiddleware)

// User API
userRouter.get("/api/users/current", userController.get)
userRouter.patch("/api/users/current", userController.update)
userRouter.delete("/api/users/logout", userController.logout)

// Grade API
userRouter.get("/api/grades/", gradeController.getAll)
userRouter.get("/api/grades/:idGrade", gradeController.get)

// Tutorial API
userRouter.get("/api/grades/:idGrade/tutorials/:idTutorial", tutorialController.get)
userRouter.get("/api/grades/:idGrade/tutorials/", tutorialController.getAllByIdGrade)

// Quiz API
userRouter.get("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/:idQuiz", quizController.get)
userRouter.get("/api/grades/:idGrade/tutorials/:idTutorial/quizzes/", quizController.getAllByIdTutorial)

// Quiz History API
userRouter.post("/api/username/:username/quizzes/:idQuiz/quiz-histories", quizHistoryController.createOrUpdate)
userRouter.get("/api/username/:username/quizzes/:idQuiz/quiz-histories", quizHistoryController.get)


export {
    userRouter
}