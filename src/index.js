const {ipcRenderer, shell} = require('electron')

document.addEventListener('click', (event) => {
  if (event.target.href) {
    // Open links in external browser
    shell.openExternal(event.target.href)
    event.preventDefault()
  } else if (event.target.classList.contains('js-refresh-action')) {
    updateData()
  } else if (event.target.classList.contains('js-quit-action')) {
    window.close()
  }
})

const getJson = (sdata) => {
  const uid = 'Registration_Number';
  const token = 'App_Token';
  const did = 'Device_ID';
  const url = `https://ums.lpu.in/UmsWebService/UmsWebService.svc/StudentBasicInfoForService/${uid}/${token}/${did}`

  return window.fetch(url).then((response) => {
    return response.json()
  })
}

const updateView = (resparr) => {
  const arr = resparr[0]
  let s = ``;
  document.querySelector('.js-attendance').textContent = `${arr.AggAttendance.substr(0,2)}%` //remove substr if you keep 100% attendance
  document.querySelector('.js-messages').textContent = arr.MyMessagesCount

  document.querySelector('.js-announcement').textContent = arr.AnnouncementCount
  document.querySelector('.js-cgpa').textContent = arr.CGPA

  document.querySelector('.js-seating').textContent = arr.SeatingPlanExamCount
  document.querySelector('.js-timetable').textContent = arr.TimeTableLectureCount

  document.querySelector('.js-balance').textContent = arr.CurrentBalance
  //css for notmarked todo
  for (let i=0; i<arr.TimeTableLectureCount; i++){
  	s = s + `<div class="quad-col"><div class="reading">${arr.TimeTable[i].CourseCode} (${arr.TimeTable[i].RoomNumber})</div><div class="description">${arr.TimeTable[i].AttendanceTime} ${arr.TimeTable[i].AttendanceType}</div></div>`
          }
  document.querySelector('.js-lectures').innerHTML = s
}

const updateData = () => {
  getJson().then((resparr) => {
    console.log('Got data', resparr)
    ipcRenderer.send('data-updated', resparr)
    updateView(resparr)
  })
}

// Update initial weather when loaded
document.addEventListener('DOMContentLoaded', updateData)