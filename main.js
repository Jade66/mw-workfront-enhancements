(function(){
  var taskCache = {};
  
  var getTaskApiUrl = function(taskId) {
    return "/attask/api/task/" + taskId + "?fields=parentID";
  };
  
  var getTaskBrowserUrl = function(taskId) {
    return "/task/view?ID=" + taskId;
  };
  
  var getTask = function(taskId) {
    var task = taskCache[taskId];
    if(!task) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", getTaskApiUrl(taskId), false);
      xhr.send();
      var responseObject = JSON.parse(xhr.responseText);
      task = responseObject.data;
      taskCache[taskId] = task;
    }
    return task;
  };
  
  var getParentTask = function(taskId) {
    var task = getTask(taskId);
    var parentId = task.parentID;
    if(parentId) {
      return getTask(parentId);
    }
    return undefined;
  };
  
  var setupMutationObserver = function(storyBox) {
    if(storyBox.hasMutationObserver) {
      return;
    }
    
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.removedNodes.length > 0) {
          setTimeout(function(){
            loadParentTask(storyBox);
          }, 500);
        }
      });
    });
    observer.observe(storyBox, { attributes: true, childList: true, characterData: true });
    storyBox.hasMutationObserver = true;
  };
  
  var addParentToStoryBox = function(storyBox, parentTask) {
    var parentTaskDiv = document.createElement('div');
    parentTaskDiv.classList.add('jg-parent-task');
    parentTaskDiv.classList.add('ellipsed-text');
    if(parentTask) {
      parentTaskDiv.id = "parent-div-" + parentTask.ID;
      parentTaskDiv.setAttribute('data-objid', parentTask.ID);
      parentTaskDiv.title = parentTask.name;
      var displayName = parentTask.name;
      if(displayName.length >= 32) {
        displayName = displayName.substring(0, 30) + '...';
      }
      parentTaskDiv.innerHTML = '<a href="' + getTaskBrowserUrl(parentTask.ID) + '">-&gt;' +  displayName + '</a>';
    }
    storyBox.appendChild(parentTaskDiv);
    setupMutationObserver(storyBox);
  };
  
  var loadParentTask = function(storyBoxNode) {
    var taskId = storyBoxNode.getAttribute('data-objid');
    var parentTask = getParentTask(taskId);
    addParentToStoryBox(storyBoxNode, parentTask);
  };
  
  var loadParentTasks = function(storyBoxNodes) {
    [].forEach.call(storyBoxNodes, function(it){
      loadParentTask(it);
    });
  };
  
  var hanldeBurndownTabClick = function(event) {
    if(event.altKey) {
      var burnDownContainer = document.getElementsByClassName('cc-box')[0];
      if(burnDownContainer) {
        if(getComputedStyle(burnDownContainer).display === "none") {
          burnDownContainer.style.display = "block";
        } else {
          burnDownContainer.style.display = "none";
        }
      }
    }
  };
  
  var addBurndownHide = function(tabId){
    var el = document.getElementById(tabId);
    if(el) {
      el.addEventListener('click', hanldeBurndownTabClick);
    }
  };
  
  setTimeout(function(){
    var taskBoxes = document.querySelectorAll('div.story');
    addBurndownHide('tab-tab-iteration-storyboard');
    addBurndownHide('tab-content-team-iterations');
    loadParentTasks(taskBoxes);
  }, 2000);
  
  window.MwWorkfront = {
    getTask : getTask,
    getParentTask : getParentTask,
    loadParentTask : loadParentTask
  };
  
})();
