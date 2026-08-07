const http = require('http');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const MOCK_COURSE_ID = 'strategic-business-analyst-enterprise-architecture';
const JWT_SECRET = 'epitome-secret-key-123456789';

// Sign mock token
const mockToken = jwt.sign({ id: 'mock-student-id' }, JWT_SECRET);

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        ...options.headers
      }
    };

    if (options.cookie) {
      requestOptions.headers['Cookie'] = options.cookie;
    }

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });
    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Course Free Preview E2E Verification ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------
    // SCENARIO 1: Guest User (Before Login)
    // ----------------------------------------
    console.log('\n--- Scenario 1 & 2: Guest Restrictions (Before Login) ---');

    console.log('Testing Fetch Lessons API (Guest)...');
    const lessonsRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/lessons`);
    assert(lessonsRes.statusCode === 200, 'Lessons API returns 200 for guest');
    assert(lessonsRes.body.success === true, 'Lessons API returns success=true');
    assert(Array.isArray(lessonsRes.body.lessons), 'Lessons API returns an array of lessons');
    
    if (lessonsRes.body.lessons && lessonsRes.body.lessons.length > 0) {
      const firstLesson = lessonsRes.body.lessons[0];
      assert(firstLesson.isFreePreview === true, 'First lesson is marked isFreePreview = true');
      assert(firstLesson.videoUrl !== null && firstLesson.videoUrl !== undefined, 'First lesson has videoUrl');
      assert(firstLesson.videoUrl.includes('6ynwj_h-DJ8') || firstLesson.videoUrl.includes('youtube'), 'First lesson plays correct preview video');
      
      const secondLesson = lessonsRes.body.lessons[1];
      if (secondLesson) {
        assert(secondLesson.isFreePreview === false, 'Second lesson is marked isFreePreview = false');
        assert(secondLesson.videoUrl === null, 'Second lesson videoUrl is null for guest');
        assert(secondLesson.isLocked === true, 'Second lesson is locked for guest');
      }
    }

    console.log('\nTesting Fetch Notes API (Guest)...');
    const notesRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/notes`);
    assert(notesRes.statusCode === 401, 'Notes API blocks guest with 401');

    console.log('\nTesting Fetch Assignments API (Guest)...');
    const assignmentsRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/assignments`);
    assert(assignmentsRes.statusCode === 401, 'Assignments API blocks guest with 401');

    console.log('\nTesting Fetch Resources API (Guest)...');
    const resourcesRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/resources`);
    assert(resourcesRes.statusCode === 401, 'Resources API blocks guest with 401');

    console.log('\nTesting Fetch Quizzes API (Guest)...');
    const quizzesRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/quizzes`);
    assert(quizzesRes.statusCode === 401, 'Quizzes API blocks guest with 401');

    console.log('\nTesting Downloads API (Guest)...');
    const downloadsRes = await makeRequest(`${BASE_URL}/api/downloads?courseId=${MOCK_COURSE_ID}`);
    assert(downloadsRes.statusCode === 401, 'Downloads API blocks guest with 401');


    // ----------------------------------------
    // SCENARIO 2: Logged-in / Enrolled User (After Login)
    // ----------------------------------------
    console.log('\n--- Scenario 3: Enrolled User (After Login) ---');
    const cookie = `token=${mockToken}`;

    console.log('Testing Fetch Lessons API (Logged-In Student)...');
    const lessonsStudentRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/lessons`, { cookie });
    assert(lessonsStudentRes.statusCode === 200, 'Lessons API returns 200 for enrolled student');
    
    if (lessonsStudentRes.body.lessons && lessonsStudentRes.body.lessons.length > 0) {
      const secondLesson = lessonsStudentRes.body.lessons[1];
      if (secondLesson) {
        assert(secondLesson.videoUrl !== null, 'Second lesson videoUrl is unlocked for enrolled student');
        assert(secondLesson.isLocked === false, 'Second lesson is unlocked for enrolled student');
      }
    }

    console.log('\nTesting Fetch Notes API (Logged-In Student)...');
    const notesStudentRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/notes`, { cookie });
    assert(notesStudentRes.statusCode === 200, 'Notes API returns 200 for enrolled student');
    assert(Array.isArray(notesStudentRes.body.notes), 'Notes API returns notes content');

    console.log('\nTesting Fetch Assignments API (Logged-In Student)...');
    const assignmentsStudentRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/assignments`, { cookie });
    assert(assignmentsStudentRes.statusCode === 200, 'Assignments API returns 200 for enrolled student');
    assert(Array.isArray(assignmentsStudentRes.body.assignments), 'Assignments API returns assignments list');

    console.log('\nTesting Fetch Resources API (Logged-In Student)...');
    const resourcesStudentRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/resources`, { cookie });
    assert(resourcesStudentRes.statusCode === 200, 'Resources API returns 200 for enrolled student');
    assert(Array.isArray(resourcesStudentRes.body.resources), 'Resources API returns downloadable files list');

    console.log('\nTesting Fetch Quizzes API (Logged-In Student)...');
    const quizzesStudentRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/quizzes`, { cookie });
    assert(quizzesStudentRes.statusCode === 200, 'Quizzes API returns 200 for enrolled student');
    assert(Array.isArray(quizzesStudentRes.body.quizzes), 'Quizzes API returns quizzes list');

    console.log('\nTesting Downloads API (Logged-In Student)...');
    const downloadsStudentRes = await makeRequest(`${BASE_URL}/api/downloads?courseId=${MOCK_COURSE_ID}`, { cookie });
    assert(downloadsStudentRes.statusCode === 200, 'Downloads API returns 200 for enrolled student');
    assert(downloadsStudentRes.body.success === true, 'Downloads API returns download validation authorized');

    console.log(`\n--- Verification Finished: Passed ${passed}/${passed + failed}, Failed ${failed} ---`);
    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
