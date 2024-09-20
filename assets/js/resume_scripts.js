// resume_scripts.js

const translations = {
    "zh": {
        "personal_info": {
            "name": "姓名",
            "age": "年龄",
            "address": "地址",
            "email": "邮箱"
        },
        "titles": {
            "education": "教育背景",
            "experience": "工作经历",
            "project_experience": "项目经验",
            "internship": "实习经历",
            "skills": "职业技能",
            "project": "项目",
            "softwareSkills": "软件技能",
            "engineeringDrawing": "工程制图",
            "languageSkills": "语言能力",
            "volunteer": "志愿者"
        }
    },
    "en": {
        "personal_info": {
            "name": "Name",
            "age": "Age",
            "address": "Address",
            "email": "Email"
        },
        "titles": {
            "education": "Education",
            "experience": "Experience",
            "project_experience": "Project Experience",
            "internship": "Internship",
            "skills": "Skills",
            "project": "Projects",
            "softwareSkills": "Software Skills",
            "engineeringDrawing": "Engineering Drawing",
            "languageSkills": "Language Skills",
            "volunteer": "Volunteer"
        }
    }
};

function loadResume(language) {
    const fileName = language === 'zh' ? 'assets/data/resume_zh.json' : 'assets/data/resume_en.json?v=' + new Date().getTime();
    
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const translation = translations[language] || translations['en'];

            // 更新个人信息标签（使用翻译表）
            document.getElementById('name').innerText = data.personal_info.name;
            document.getElementById('label-age').innerText = `${translation.personal_info.age}:`;
            document.getElementById('label-address').innerText = `${translation.personal_info.address}:`;
            document.getElementById('label-email').innerText = `${translation.personal_info.email}:`;

            // 设置个人信息的值
            document.getElementById('age').innerText = data.personal_info.age;
            document.getElementById('address').innerText = data.personal_info.address;
            document.getElementById('email').innerText = data.personal_info.email;

            // 设置个人照片
            const photoSrc = `assets/images/${data.personal_info.photo}`;
            document.getElementById('profile-photo').src = photoSrc;

            // 更新教育背景、工作经历、项目经验、实习经历、职业技能的标题
            document.getElementById('education-title').innerText = translation.titles.education;
            document.getElementById('experience-title').innerText = translation.titles.experience;
            document.getElementById('project-experience-title').innerText = translation.titles.project_experience;
            document.getElementById('internship-title').innerText = translation.titles.internship;
            document.getElementById('skills-title').innerText = translation.titles.skills;

            // 教育背景：调整布局，将毕业时间移到右侧
            let educationContent = data.education.map(edu => 
                `<div class="education-item">
                    <div class="education-degree-wrapper">
                        <div class="education-degree">
                            <strong>${edu.degree}</strong> - ${edu.major}
                        </div>
                        <div class="education-date">${edu.graduation_date}</div>
                    </div>
                    <div class="education-school">
                        ${edu.school}
                    </div>
                    <div class="education-gpa">GPA: ${edu.gpa}</div>
                </div>`
            ).join('');
            document.getElementById('education').innerHTML = educationContent;

            // 工作经验
            let experienceContent = data.experience ? data.experience.map(exp => {
                const projects = Array.isArray(exp.project) 
                    ? exp.project.map(proj => `
                        <div class="project-item">
                            <h5 class="project-title">${proj.name} (${proj.date})</h5>
                            <ul>${proj.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
                        </div>
                    `).join('') 
                    : '';

                return `
                    <div class="experience-item">
                        <h4>${exp.position} - ${exp.company} (${exp.date})</h4>
                        ${projects}
                    </div>
                `;
            }).join('') : 'No experience data';
            document.getElementById('experience').innerHTML = experienceContent;

            // 项目经验
            let projectExperienceContent = data.project_experience ? data.project_experience.map(projExp => {
                const projects = Array.isArray(projExp.project) 
                    ? projExp.project.map(proj => `
                        <div class="project-item">
                            <h5 class="project-title">${proj.name}</h5>
                            <ul>${proj.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
                        </div>
                    `).join('') 
                    : '';

                return `
                    <div class="experience-item">
                        <h4>${projExp.from} (${projExp.date})</h4>
                        ${projects}
                    </div>
                `;
            }).join('') : 'No project experience data';
            document.getElementById('project-experience').innerHTML = projectExperienceContent;

            // 实习经历
            let internshipContent = data.internship ? data.internship.map(intern => {
                const responsibilities = Array.isArray(intern.responsibilities) 
                    ? intern.responsibilities.map(res => `<li>${res}</li>`).join('')
                    : '';

                return `
                    <div class="experience-item">
                        <h4>${intern.position} - ${intern.company} (${intern.date})</h4>
                        <ul>${responsibilities}</ul>
                    </div>
                `;
            }).join('') : 'No internship data';
            document.getElementById('internship').innerHTML = internshipContent;

            // 职业技能和志愿者
            let skillsContent = `
                <p><strong>${translation.titles.softwareSkills}:</strong> ${data.skills.software.join(', ')}</p>
                <p><strong>${translation.titles.engineeringDrawing}:</strong> ${data.skills.engineering_drawing.join(', ')}</p>
                <p><strong>${translation.titles.languageSkills}:</strong> ${data.skills.languages.join(', ')}</p>
            `;
            
            // 志愿者部分
            let volunteerContent = `
                <p><strong>${data.skills.others.name}:</strong> ${data.skills.others.description}</p>
            `;
            
            // 合并志愿者内容到职业技能部分
            skillsContent += volunteerContent;

            document.getElementById('skills').innerHTML = skillsContent;
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });
}
