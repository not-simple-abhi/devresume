/**
 * Quick debug test using Abhinav's actual resume text.
 * Run: node test/parser.debug.js
 */
import { parseResume } from '../src/parsers/resumeParser.js';

const RAW_TEXT = `Abhinav Kumar  +91-9205004103 | abhinav.kumar.ug24@nsut.ac.in | LinkedIn | LeetCode  EDUCATION Course   College / University   Year   CGPA / %  B.Tech (Information Technology)   Netaji Subhas University of Technology   2028   7.17 Board (Class XII)   Kendriya Vidyalaya   2023   85.4% Board (Class X)   Kendriya Vidyalaya   2021   94%  PROJECT Smart and Tamper-Proof Parking Management System  Built a full-stack real-time parking tracking prototype using MongoDB, Express.js, React.js, and Node.js. Implemented a hashcode-based security algorithm in the backend to keep data safe and prevent tampering. Designed role-based login workflows to make dashboard access simple for both admins and general users.  Student Management System  Created a complete web application with Flask, Python, and MySQL to digitize university academic logs. Designed a clean relational database to cleanly track student profiles, daily attendance, and grading matrices. Built a straightforward dashboard interface using HTML, CSS, and JavaScript for smooth data entry and updates.  POSITIONS OF RESPONSIBILITY Core Working Member | Open Mic Society, NSUT   Aug 2024 - Present  Helped organize multiple campus cultural events, handling backend planning and stage logistics smoothly. Managed coordination between performers and technical crews to ensure scheduling ran on time. Presented updates during society assemblies and promoted upcoming college shows to boost general audience turnout.  ACADEMIC ACHIEVEMENTS Achieved 98.625 percentile in JEE Mains out of more than 1 million participating students. Selected in the Top 215 out of 1,200 teams at the national level HACK4DELHI hackathon. Successfully solved over 260+ algorithmic questions on LeetCode covering key data structure fundamentals. OTHER INFORMATION  Languages:   C++, Python, JavaScript, SQL, HTML5, CSS3  Frameworks & Tools:   React.js, Node.js, Express.js, Flask, Git, GitHub, RESTful APIs  Databases:   MySQL, MongoDB, Database Design  Core CS Concepts:   Operating Systems (OS), Database Management Systems (DBMS), Computer Networks, Data Structures & Algorithms (DSA), Object-Oriented Programming (OOPs)  •  ◦ ◦ ◦  •  ◦ ◦ ◦  •  ◦ ◦ ◦  •  •  •`;

const result = parseResume(RAW_TEXT);

console.log('\n=== PARSE RESULT ===\n');
console.log('Name:', result.name);
console.log('Email:', result.email);
console.log('Phone:', result.phone);
console.log('Skills:', result.skills);
console.log('Projects:', result.projects.length, 'found');
result.projects.forEach((p, i) => console.log(`  Project ${i+1}:`, p.substring(0, 80)));
console.log('Experience:', result.experience.length, 'found');
console.log('Education:', result.education.length, 'found');
console.log('Achievements:', result.achievements.length, 'found');
result.achievements.forEach(a => console.log(' -', a.substring(0, 80)));
