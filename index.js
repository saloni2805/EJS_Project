const express = require("express")
const path = require("path")
const app = express()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "127.0.0.1"

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.render("registration/login.ejs")
})

app.post("/login", (req, res) => {
  const { email, password } = req.body
  console.log(email, password)
  res.redirect("/home")
})

// 2. Render the home.ejs on GET /home
app.get("/home", (req, res) => {
  res.render("home/home")
})

// -------------> Sign up <--------------
app.get("/signup", (req, res) => res.render("registration/signup.ejs"))
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body
  console.log(name, email, password)
  res.redirect("/")
})

// ------------> Placement <------------
app.get("/placement", (req, res) => {
  res.render("placement/placement_index")
})

// ----------> add company <---------
app.get("/add_company", (req, res) =>
  res.render("placement/add_company/add_company_index")
)

// ---------> interview calls <-----------
app.get("/interview_calls", (req, res) =>
  res.render("placement/interview_calls/interview_calls_index")
)

// ----------> interview Details <---------
app.get("/interview_calls/interview_details", (req, res) => {
  res.render("placement/interview_calls/interview_details")
})

// ------------> Recruitment <------------
app.get("/recruitment", (req, res) => {
  res.render("recruitment/recruitment_index")
})

// -----------> job posts <------------
app.get("/job_posts", (req, res) =>
  res.render("recruitment/job_posts/job_posts_index")
)

// ----------> schedule interview <----------
app.get("/scheduled_interview", (req, res) =>
  res.render("recruitment/scheduled_interviews/scheduled_interviews_index")
)

// ----------> offers <--------
app.get("/offers", (req, res) => res.render("recruitment/offers/offers_index"))

// ---------> recruitment- REPORTS <--------
app.get("/recruitment_report", (req, res) =>
  res.render("recruitment/report/report_index")
)

app.listen(PORT, HOST, () => {
  console.log(`Server is up on http://${HOST}:${PORT}`)
})
