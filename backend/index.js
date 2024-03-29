/*
  Firebase Functions
  Heroku (may cost money)
  Vercel potentially for backend (definitely frontend)
*/

//create backend, do npm init
//init makes the package.json
//npm install installs the dependencies
const express = require("express");
const cors = require("cors");
const admin = require("./src/firebase/cred.js");
const dotenv = require("dotenv").config();
const authMiddleware = require("./src/auth/index.js");
const uuid = require("uuid");
const { response } = require("express");

//firestore is the database
//firebase is the entire service
// Intialize firestore instance
const db = admin.firestore();

// Define app and port
const app = express();
const port = process.env.PORT;
// More Middlware
app.use(cors());
app.use(express.json());

//Initialize Port
app.listen(port, () => console.log(`Listening on Port ${port}!`));

// Use Authentication for all Routes
app.use("/", authMiddleware);

// Call to Check if User is Valid
app.get("/auth", authMiddleware, (req, res) => {
  return res.json({ msg: "Success" });
});

app.post('/member', async (req, res) => {
  try {
    const member = req.body.member;
    const snapshot = await db.collection('members');

    const USER = { name: member.name, email: member.email, admin: false, id: member.user_id, type: "Member"};
    const user_exists = (await snapshot.doc(member.user_id).get()).exists;
    if (!user_exists) {
      const newSnapshot = await db.collection('members').doc(member.user_id).set(USER);
      const result = await snapshot.doc(member.user_id).get();
      return res.json({ msg: "Created a new user", data: result.data() });
    } else {
      const result = await snapshot.doc(member.user_id).get();
      return res.json({ msg: "User already exists", data: result.data() });
    }

  } catch (error) {
    return res.status(400).send(`User should contain firstName, lastName, email`)
  }
});

app.post('/admin', async (req, res) => {
  try {
    const member = req.body.id;
    const snapshot = await db.collection('members');
    await snapshot.doc(member).update({ admin: true });
    const result = await snapshot.doc(member).get();
    return res.json({ msg: "Success"});
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

app.post('/revokeAdmin', async (req, res) => {
  try {
    const member = req.body.id;
    const snapshot = await db.collection('members');
    await snapshot.doc(member).update({ admin: false });
    const result = await snapshot.doc(member).get();
    return res.json({msg: "Success"});
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

app.get('/authAdmin', async (req, res) => {
  try {
    const member = req.body.member;
    const snapshot = await db.collection('members');
    const result = (await snapshot.doc(member.user_id).get())['admin'];
    return res.json({ msg: "Success", data: result});
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

app.get('/members_list', async (req, res) => {
  try {
    const snapshot = await db.collection('members').get();
    const members = [];
    snapshot.docs.forEach(doc => members.push(doc.data()));
    return res.json({ msg: "Success", data: members });
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

app.post('/meeting', async (req, res) => {
  try {
    const meeting = req.body;
    const snapshot = await db.collection('meetings');
    const id = uuid.v1();
    const MEETING = { name: meeting.name, password: meeting.password, start: meeting.start, end: meeting.end, fStart: dateFormat(meeting.start), fEnd: dateFormat(meeting.end), day: getFormattedDate(meeting.start), type: meeting.type, id: id };
    const newSnapshot = await db.collection('meetings').doc(id).set(MEETING);
    const result = await snapshot.doc(id).get();
    return res.json({ msg: "Created a new meeting", data: result.data() });

  } catch (error) {
    return res.status(400).send(`User should contain firstName, lastName, email`)
  }
});

app.get('/meetings_list', async (req, res) => {
  try {
    const snapshot = await db.collection('meetings').get();
    const meetings = [];
    snapshot.docs.forEach(doc => meetings.push(doc.data()));
    return res.json({ msg: "Success", data: meetings });
  } catch (error) {
    return res.status(400).send(`Unavailable to get meetings`)
  }
});

app.post('/running_meetings', async (req, res) => {
  try {
    const snapshot = await db.collection('meetings').get();
    const meetings = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if(req.body.date >= Math.round(Date.parse(data.start) / 1000) && req.body.date < Math.round(Date.parse(data.end) / 1000)){
        if(!meetings.hasOwnProperty(data.type) || !(new Date(meetings[data.type].start)).getTime() > (new Date(data.start)).getTime()){
          meetings[data.type] = data;
          delete meetings[data.type].password;
        }
      }
    });
    return res.json({ msg: "Success", data: meetings });
  } catch (error) {
    return res.status(400).send(`Unable to obtain running meetings`)
  }
});

function dateFormat(date) {
  let formatter = Intl.DateTimeFormat(
    "default", // a locale name; "default" chooses automatically
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }
  );


  return formatter.format(Date.parse(date));
}

function getFormattedDate(d) {
  var date = new Date(Date.parse(d));
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var yyyy = date.getFullYear();
  return mm + '/' + dd + '/' + yyyy;
}

app.delete('/delete_meeting', async (req, res) => {
  try {
    const snapshot = await db.collection('meetings');
    await snapshot.doc(req.body.meeting.toString()).delete().catch((error) => { console.log("Error removing document:", error) });
    return res.json({ msg: "Success", data: snapshot });
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

app.post('/attendance_list', async (req, res) => {
  try {
    const meetings = await db.collection('meetings').get();
    const member = await db.collection('members').doc(req.body.id).get();
    const memberData = member.data();
    const attendance_list = [];
    now = Date.now()
    
    meetings.docs.forEach(doc => {
      const meeting = doc.data();
      if((new Date(meeting.start)).getTime() < now && (meeting.type == memberData.type || meeting.type == "General")){
        const attendanceStatus = member.data().hasOwnProperty(meeting.id)?member.data()[meeting.id]:"Absent";
        attendance_list.push({id: meeting.id, name: meeting.name, day: meeting.day, type: meeting.type, attendance: attendanceStatus});
      }
    });
    return res.json({ msg: "Success", data: attendance_list, type: memberData['type']});
  } catch (error) {
    return res.status(400).send(`Unable to retrieve attendance list`)
  }
});

app.post('/signin', async (req, res) => {
  try {
    const member = req.body.member;
    const snapshot = await db.collection('members');
    const meetingSnapshot = await db.collection('meetings');
    const id = req.body.id;
    const meeting = await meetingSnapshot.doc(id).get();
    const lateJSON = {};
    if(req.body.password !== meeting.data().password){
      return res.json({correctPassword: false});
    }
    const startDate = new Date(meeting.data().start)
    lateJSON[id] = (req.body.date > startDate.getTime()+10*60*1000)?"Late":"Present";
    await snapshot.doc(member.user_id).update(lateJSON);
    return res.json({correctPassword: true});
  } catch (error) {
    return res.status(400).send(`Failed to verify password`)
  }
});

app.post('/password', async (req, res) => {
  try {
    const id = req.body.meeting;
    const snapshot = await db.collection('meetings');
    const result = await snapshot.doc(id).get();
    return res.json({correctPassword: (req.body.password == result.password)});
  } catch (error) {
    return res.status(400).send(`Failure to verify password`)
  } 
});

app.post('/update_attendance', async (req, res) => {
  try {
    const member = req.body.member;
    
    const snapshot = await db.collection('members');
    const id = req.body.id;
    const status = req.body.status;
    const attendanceJSON = {};
    attendanceJSON[id] = status;
    await snapshot.doc(member).update(attendanceJSON);
    const result = await snapshot.doc(member).get();
    const meetings = await db.collection('meetings').get();
    const attendance_list = [];
    meetings.docs.forEach(doc => {
      if(result.data().hasOwnProperty(doc.id)){
        attendance_list.push([result.data()[doc.id],doc.data()['type']]);
      }else{
        attendance_list.push(["Absent", doc.data()['type']]);
      }
    });
    return res.json({ msg: "Success", data: attendance_list});
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

app.post('/member_type', async (req, res) => {
  try {
    const member = req.body.member;
    const snapshot = await db.collection('members');
    await snapshot.doc(member).update({type: req.body.type});
    const result = await snapshot.doc(member).get();
    return res.json({ msg: "Success", data: result.data() });
  } catch (error) {
    return res.status(400).send(`User does not exist`)
  }
});

