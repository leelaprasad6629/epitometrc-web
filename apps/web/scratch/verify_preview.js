const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const MOCK_COURSE_ID = 'strategic-business-analyst-enterprise-architecture';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
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
    // Test 1: Fetch Lessons API (Guest Access)
    console.log('\nTesting Fetch Lessons API (Guest)...');
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

    // Test 2: Fetch Notes API (Guest Blocked)
    console.log('\nTesting Fetch Notes API (Guest)...');
    const notesRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/notes`);
    assert(notesRes.statusCode === 401, 'Notes API blocks guest with 401');

    // Test 3: Fetch Assignments API (Guest Blocked)
    console.log('\nTesting Fetch Assignments API (Guest)...');
    const assignmentsRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/assignments`);
    assert(assignmentsRes.statusCode === 401, 'Assignments API blocks guest with 401');

    // Test 4: Fetch Resources API (Guest Blocked)
    console.log('\nTesting Fetch Resources API (Guest)...');
    const resourcesRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/resources`);
    assert(resourcesRes.statusCode === 401, 'Resources API blocks guest with 401');

    // Test 5: Fetch Quizzes API (Guest Blocked)
    console.log('\nTesting Fetch Quizzes API (Guest)...');
    const quizzesRes = await makeRequest(`${BASE_URL}/api/courses/${MOCK_COURSE_ID}/quizzes`);
    assert(quizzesRes.statusCode === 401, 'Quizzes API blocks guest with 401');

    // Test 6: Downloads API (Guest Blocked)
    console.log('\nTesting Downloads API (Guest)...');
    const downloadsRes = await makeRequest(`${BASE_URL}/api/downloads?courseId=${MOCK_COURSE_ID}`);
    assert(downloadsRes.statusCode === 401, 'Downloads API blocks guest with 401');

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
