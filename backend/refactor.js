const fs = require('fs');
const path = require('path');

const srcMainJava = path.join(__dirname, 'src', 'main', 'java', 'com', 'nckh', 'backend');

// Mapping filename -> new subpackage
const fileToSubpkg = {
  // core
  "SecurityConfig.java": "core/config",
  "GlobalExceptionHandler.java": "core/exception",
  "PublicController.java": "core/common",
  
  // auth
  "AuthController.java": "auth",
  "GoogleLoginRequest.java": "auth",
  "LoginRequest.java": "auth",
  "JwtResponse.java": "auth",
  "ChangePasswordRequest.java": "auth",
  "JwtAuthenticationFilter.java": "auth",
  "JwtTokenProvider.java": "auth",
  "UserDetailsImpl.java": "auth",
  "UserDetailsServiceImpl.java": "auth",

  // user
  "UserController.java": "user",
  "UpdateProfileRequest.java": "user",
  "UserProfileResponse.java": "user",
  "User.java": "user",
  "Role.java": "user",
  "UserRepository.java": "user",

  // document
  "DocumentController.java": "document",
  "DocumentResponse.java": "document",
  "Document.java": "document",
  "DocumentRepository.java": "document",
  "FileService.java": "document",

  // research - topic
  "ResearchTopicController.java": "research/topic",
  "ResearchTopicRequest.java": "research/topic",
  "ResearchTopic.java": "research/topic",
  "ResearchTopicRepository.java": "research/topic",

  // research - paper
  "ScientificPaperController.java": "research/paper",
  "ScientificPaperRequest.java": "research/paper",
  "ScientificPaper.java": "research/paper",
  "ScientificPaperRepository.java": "research/paper",

  // research - product
  "ResearchProductController.java": "research/product",
  "ResearchProductRequest.java": "research/product",
  "ResearchProduct.java": "research/product",
  "ResearchProductRepository.java": "research/product",

  // research - stats
  "StatisticsResponseDTO.java": "research/stats",
  "StatisticsService.java": "research/stats",

  // legacy
  "ArticleController.java": "legacy",
  "TopicController.java": "legacy",
  "ArticleRequest.java": "legacy",
  "TopicRequest.java": "legacy",
  "Article.java": "legacy",
  "Topic.java": "legacy",
  "ArticleRepository.java": "legacy",
  "TopicRepository.java": "legacy",
  "ArticleService.java": "legacy",
  "TopicService.java": "legacy"
};

const oldDirs = ['config', 'controller', 'dto', 'exception', 'model', 'repository', 'security', 'service'];
let classMap = {};

const allFiles = [];

for (const dir of oldDirs) {
  const dirPath = path.join(srcMainJava, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.java'));
    for (const file of files) {
      allFiles.push({
        name: file,
        className: file.replace('.java', ''),
        oldPath: path.join(dirPath, file),
        oldPkg: `com.nckh.backend.${dir}`
      });
    }
  }
}

for (const file of allFiles) {
  const subpkg = fileToSubpkg[file.name] || 'core';
  const newPkg = `com.nckh.backend.${subpkg.replace(/\//g, '.')}`;
  file.newPkg = newPkg;
  file.newSubpkg = subpkg;
  file.newPath = path.join(srcMainJava, ...subpkg.split('/'), file.name);
  
  classMap[file.className] = {
    oldFqcn: `${file.oldPkg}.${file.className}`,
    newFqcn: `${newPkg}.${file.className}`,
    className: file.className,
    newPkg: newPkg
  };
}

for (const file of allFiles) {
  const dir = path.dirname(file.newPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

for (const file of allFiles) {
  let content = fs.readFileSync(file.oldPath, 'utf8');

  // Change package declaration
  content = content.replace(`package ${file.oldPkg};`, `package ${file.newPkg};`);

  // Change explicit imports
  for (const cls in classMap) {
    if (classMap[cls].oldFqcn !== classMap[cls].newFqcn) {
      const oldImport = `import ${classMap[cls].oldFqcn};`;
      const newImport = `import ${classMap[cls].newFqcn};`;
      content = content.replace(new RegExp(oldImport.replace(/\./g, '\\.'), 'g'), newImport);
    }
  }

  // Inject missing imports if a class is used but not imported (because it was in the same pkg before)
  for (const cls in classMap) {
    const classInfo = classMap[cls];
    // If it's a different package now
    if (classInfo.newPkg !== file.newPkg) {
      // If the word appears in the file
      const regex = new RegExp(`\\b${classInfo.className}\\b`);
      if (regex.test(content)) {
        // And it's not imported
        if (!content.includes(`import ${classInfo.newFqcn};`)) {
          // Add import immediately after the first import or package declaration
          const importStmt = `import ${classInfo.newFqcn};\n`;
          if (content.includes('import')) {
            content = content.replace(/import /, importStmt + 'import ');
          } else {
            content = content.replace(/package .+;\n+/, `$&${importStmt}\n`);
          }
        }
      }
    }
  }

  fs.writeFileSync(file.newPath, content, 'utf8');
}

const mainAppPath = path.join(srcMainJava, 'BackendApplication.java');
if (fs.existsSync(mainAppPath)) {
  let mainContent = fs.readFileSync(mainAppPath, 'utf8');
  for (const cls in classMap) {
    if (classMap[cls].oldFqcn !== classMap[cls].newFqcn) {
      const oldImport = `import ${classMap[cls].oldFqcn};`;
      const newImport = `import ${classMap[cls].newFqcn};`;
      mainContent = mainContent.replace(new RegExp(oldImport.replace(/\./g, '\\.'), 'g'), newImport);
    }
  }
  fs.writeFileSync(mainAppPath, mainContent, 'utf8');
}

for (const file of allFiles) {
  if (file.oldPath !== file.newPath) {
    fs.rmSync(file.oldPath, { force: true });
  }
}

for (const dir of oldDirs) {
  const dirPath = path.join(srcMainJava, dir);
  if (fs.existsSync(dirPath)) {
    try {
      if (fs.readdirSync(dirPath).length === 0) {
        fs.rmdirSync(dirPath);
      }
    } catch(e) {}
  }
}

console.log('Refactoring complete!');
