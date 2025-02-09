# VITALII DUSHKIN

## CONTACTS

- Phone: [+55 555 555 5555][phone]
- E-mail: [john.doe@example.com][email]
- LinkedIn: [Vitalii Dushkin][linkedin]
- GitHub: [vetalapo][github]

## SUMMARY

Enthusiastic and dedicated software engineer with a passion for crafting clean and efficient code. Eager to contribute to dynamic projects and grow within a collaborative team environment. Possesses a strong foundation in programming principles, a quick learner, and committed to staying abreast of emerging technologies. As a software engineer, I believe in the continuous pursuit of knowledge and am ready to contribute to innovative solutions.

## SKILLS

- Programming Languages: Python, JavaScript
- Web Development: HTML, CSS, React.js
- Database: MongoDB, PostgreSQL
- Version Control: Git
- Tools: VS Code, JIRA
- Methodologies: Agile

## CODE EXAMPLE

From [CODEWARS][codewars-isogram] (JavaScript):<br />
Implement a function that determines whether a string that contains only letters is an isogram.<br />
An isogram is a word that has no repeating letters, consecutive or non-consecutive.<br />
Note: Assume the empty string is an isogram. Ignore letter case.

```
function isIsogram(str) {
  str = str.toLowerCase();
  let set = new Set();
  
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    
    if (set.has(char)) {    
      return false;
    }
    
    set.add(char);
  }
  
  return true;
}
```

## PROJECT EXAMPLES

1. **Weather App (JavaScript):** [github.com/vetalapo/weather-app][weather-app]
   - Developed a simple weather application using React.js and integrated it with a weather API to display real-time weather information.

2. **Task Manager (Python):** [github.com/vetalapo/task-manager][py-task-manager]
   - Created a command-line task manager application in Python, showcasing CPU monitoring and processes handling.

## EXPERIENCE

### Freelance Web Developer | Upwork
*March 2023 - Present*
- Executed multiple freelance projects, including website development and bug fixing.
- Collaborated with clients to understand project requirements and deliver tailored solutions.
- Developed responsive and user-friendly interfaces using HTML, CSS, and React.js.

### Coding Challenges | HackerRank, LeetCode
*September 2022 - Present*
- Regularly participated in coding challenges to enhance problem-solving skills and algorithmic thinking.
- Achieved a top 5% ranking in algorithmic problem-solving competitions.

## EDUCATION

**Bachelor of Science in Computer Science | University XYZ**
*2022*

**Online Courses:**
- Web Development Bootcamp | Udemy
- Python for Beginners | Codecademy

## LANGUAGES

Proficient in English, with regular practice through online communication, documentation, and participation in English-speaking coding communities. Completed a language exchange program, engaging in daily conversations for six months to enhance spoken and written English skills.


[linkedin]: https://www.linkedin.com/in/vitaly-dushkin/
[github]: https://github.com/vetalapo/
[email]: mailto:john.doe@example.com
[phone]: tel:555555555555
[codewars-isogram]: https://www.codewars.com/kata/54ba84be607a92aa900000f1
[weather-app]: https://github.com/hamza-mirza/react-weather-app
[py-task-manager]: https://github.com/darxtrix/ptop
