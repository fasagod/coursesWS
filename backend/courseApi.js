function getCourses(list_type, name, status, duration) {
    var listType = list_type;
    alert(listType +" " + name+" " + status+" " + duration);

    if(listType == 'my') {
        return _getMyCourses(name, status);
    }
    return _getAllCourses(name, status, duration);
}


function _getMyCourses(name, status) {
    var oRes = [];
    var arrConds = [];
    var sCondQuery = "";
    var userId = 6148914691236517121;
    statusList = {
        "assigned": 0,
        "inProgress": 1,
        "done": 2,
        "notPass": 3,
        "passed": 4,
        "viewed": 5
    }
    if(!IsEmptyValue(userId)){
        arrConds.push("$elem/person_id = "+userId+" ");
    }
    if(!IsEmptyValue(name)){
        arrConds.push("contains($elem/course_name, '"+name+"')");
    }
    if(!IsEmptyValue(status)){
        stateId = statusList.GetOptProperty(status);
        if(stateId != undefined)
            arrConds.push("$elem/state_id = "+stateId+" ");
        else
            alert(status + " not found");
    }
    if(ArrayCount(arrConds) > 0) {
        sCondQuery = "where " + arrConds.join(' and ');
    }

    alert(sCondQuery);
    activeL = XQuery("for $elem in active_learnings "+sCondQuery+" return $elem");
    notActiveL = XQuery("for $elem in learnings "+sCondQuery+" return $elem");

    allLearnings = ArrayUnion(activeL, notActiveL);
    for (learning  in allLearnings) {
        oLearn = {}
        sDesc = "";
        iDuration = 0;
        oCourse = learning.course_id.OptForeignElem;
        if(oCourse != undefined){
            docCourse = tools.open_doc(oCourse.id);
            if(docCourse != undefined){
                teCourse = docCourse.TopElem;
                sDesc = teCourse.desc;
                if(teCourse.duration != null)
                    iDuration = teCourse.duration;
            }
        }


        if(iDuration == 0 && learning.max_end_date != null && learning.start_usage_date != null) {
            diffSeconds = DateDiff(learning.max_end_date, learning.start_usage_date);
            iDuration = diffSeconds / 60 / 60 / 24;
        }
        start_usage_date = StrDate(learning.start_usage_date,false);
        start_learning_date = StrDate(learning.start_learning_date,false);
        last_usage_date = StrDate(learning.last_usage_date,false);
        max_end_date = StrDate(learning.max_end_date,false);

        oLearn.SetProperty("id", learning.id);
        oLearn.SetProperty("course_id", learning.course_id);
        oLearn.SetProperty("name", learning.course_name);
        oLearn.SetProperty("state_id",learning.state_id);
        oLearn.SetProperty("max_score", learning.max_score);
        oLearn.SetProperty("score", learning.score);
        oLearn.SetProperty("start_usage_date", start_usage_date);
        oLearn.SetProperty("start_learning_date", start_learning_date);
        oLearn.SetProperty("last_usage_date", last_usage_date);
        oLearn.SetProperty("max_end_date", max_end_date);
        oLearn.SetProperty("time", learning.time);
        oLearn.SetProperty("description", sDesc);
        oLearn.SetProperty("duration", iDuration);
        oRes.push(oLearn);
    }

    return EncodeJson(oRes);
}
function _getAllCourses(name, status, duration) {
    var oRes =  [];
    var arrConds = [];
    var sCondQuery = "";

    if(!IsEmptyValue(name)){
        arrConds.push("contains($elem/name, '"+name+"')");
    }
    if(!IsEmptyValue(status)){
        arrConds.push("$elem/status = '"+status+"'");
    }
    if(!IsEmptyValue(duration)){
        arrConds.push("$elem/duration = '"+duration+"'");
    }

    if(ArrayCount(arrConds) > 0) {
        sCondQuery = "where " + arrConds.join(' and ');
    }
    alert(sCondQuery);
    arrCourses = XQuery("for $elem in courses "+sCondQuery+" return $elem");

    for (course in arrCourses) {
        oCourse = {};
        desc = "";
        docCourse = tools.open_doc(course.id);
        if(docCourse != undefined){
            teCourse = docCourse.TopElem;
            desc = teCourse.desc;
        }
        oCourse.SetProperty("id", course.id);
        oCourse.SetProperty("name", course.name);
        oCourse.SetProperty("status", course.status);
        oCourse.SetProperty("max_score", course.max_score);
        oCourse.SetProperty("duration", course.duration);
        oCourse.SetProperty("desc", teCourse.desc);

        oRes.push(oCourse);
    }

    return EncodeJson(oRes);
}

function assignCourse(obj) {
    var courseId = obj.courseId;
    var oRes =
        {
            "message": ""
        };

    learning = tools.activate_course_to_person(6148914691236517121, courseId);

    if ( OptInt ( learning, 0) == 0) {
        oRes.message = RValue(learning.TopElem.course_id)+"";
    }
    return oRes;
}

function getCourseUrl(course_id, learning_id) {
    if(IsEmptyValue(course_id)){
        return ""
    }
    if(IsEmptyValue(learning_id)){
        return ""
    }

    sUrl = "course_launch.html?course_id=" + course_id
        + "&launch_id=" + tools_web.encrypt_launch_id( learning_id, DateOffset( Date(), 3600 ) );

    return sUrl;
}