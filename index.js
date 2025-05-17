const express = require("express")
const path = require("path")
const app = express()
var connection = require("./config/db")
// var connection = require("./config/db")

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
app.get("/recruitment", async (req, res) => {
  res.render("recruitment/recruitment_index")
})

// -----------> job posts <------------
app.get("/job_posts", async (req, res) => {
  try {
    var sql = `select * from candidate_data`
    // result in the form of array object
    const [result] = await connection.execute(sql)
    const obj = { data: result }
    console.log(obj)
    res.render("recruitment/job_posts/job_posts_index", obj)
    console.log("Data Fetched Successfully..")
  } catch (err) {
    console.log(err)
    console.log("Data faild to fetch..")
    return
  }
})

app.get("/add_candidate", (req, res) => {
  res.render("recruitment/job_posts/add_candidate")
})

app.post("/save_candidate_form", async (req, res) => {
  try {
    const {
      candidate_name,
      candidate_email,
      candidate_gender,
      candidate_experience,
      job_post_type,
    } = req.body
    var sql = `insert into candidate_data (candidate_name,candidate_email,candidate_gender,candidate_experience,job_post_type,created_at) values('${candidate_name}','${candidate_email}','${candidate_gender}','${candidate_experience}','${job_post_type}',NOW())`
    await connection.execute(sql)
    console.log("Data Inserted Successfully....")
    res.send(`<script>
      alert('Candidate added successfully');
      window.location.href='/job_posts'
      </script>`)
  } catch (err) {
    console.log(err)
    console.log("Faild to Insert Data....")
    return
  }
})

app.get("/delete_candidate/:id", async (req, res) => {
  try {
    var id = req.params.id
    var sql = `delete from candidate_data where candidate_id='${id}'`
    await connection.execute(sql)
    res.send(`<script>
      alert('Candidate deleted successfully');
      window.location.href='/job_posts'
      </script>`)
  } catch (err) {
    console.log(err)
    console.log("Faild to Delete Candidate")
  }
})

app.get("/view_candidate/:id", async (req, res) => {
  try {
    var id = req.params.id
    var sql = `select * from candidate_data where candidate_id='${id}'`
    const [result] = await connection.execute(sql)
    const obj = { data: result[0] }
    console.log(obj)
    res.render("recruitment/job_posts/view_candidate", obj)
    // res.send(`<script>
    //   alert('Interview scheduled successfully');
    //   window.location.href='/job_posts'
    //   </script>`)
  } catch (err) {
    console.log(err)
    console.log("Faild to view Candidate")
  }
})

app.post("/schedule_interview", async (req, res) => {
  try {
    const {
      candidate_name,
      candidate_email,
      candidate_gender,
      candidate_experience,
      job_post_type,
      scheduled_on,
      remark,
    } = req.body
    var sql = `insert into schedule_interview (candidate_name,candidate_email,candidate_gender,candidate_experience,job_post_type, scheduled_on, remark, created_at) values('${candidate_name}','${candidate_email}','${candidate_gender}','${candidate_experience}','${job_post_type}','${scheduled_on}','${remark}',NOW())`
    await connection.execute(sql)
    console.log("Data Inserted Successfully....")
    res.send(`<script>
      alert('Interview scheduled successfully');
      window.location.href='/job_posts'
      </script>`)
  } catch (err) {
    console.log(err)
    console.log("Faild to Insert Data....")
    return
  }
})

app.get("/edit_candidate/:id", async (req, res) => {
  try {
    var id = req.params.id
    var sql = `select * from candidate_data where candidate_id='${id}'`
    const [result] = await connection.execute(sql)
    const obj = { data: result[0] }
    console.log(obj)
    res.render("recruitment/job_posts/edit_candidate", obj)
  } catch (err) {
    console.log(err)
    console.log("Data faild to fetched ....Edit User")
  }
})

app.post("/update_candidate_form", async (req, res) => {
  try {
    const {
      candidate_name,
      candidate_email,
      candidate_gender,
      candidate_experience,
      job_post_type,
      id,
    } = req.body

    var sql = `update candidate_data
        set 
       candidate_name='${candidate_name}',
        candidate_email='${candidate_email}',
        candidate_gender='${candidate_gender}',
        candidate_experience='${candidate_experience}',
        job_post_type='${job_post_type}'
        where candidate_id='${id}'`

    await connection.execute(sql)

    res.redirect("/job_posts")
  } catch (err) {
    console.log(err)
    console.log("Faild to update data")
  }
})

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
