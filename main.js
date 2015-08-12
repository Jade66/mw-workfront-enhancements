(function(){
  var taskCache = {};
  
  var getTaskApiUrl = function(taskId) {
    return "/attask/api/task/" + taskId + "?fields=parentID";
  };
  
  var getTaskBrowserUrl = function(taskId) {
    return "/task/view?ID=" + taskId;
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

  var getTaskAsync = function(taskId, callback) {
    var task = taskCache[taskId];
    if(task) {
      callback(null, task);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){callback(xhr);};
      xhr.open("get", getTaskApiUrl(taskId));
      xhr.send();
    }
  };
  
  var getParentTaskAsync = function(taskId, storyBoxNode) {
    var callback = function(xhr, task) {
      if(!task) {
        if(4 != xhr.readyState) {
          return;
        }
        if(200 != xhr.status) {
          throw "Ajax to get task object failed with code " + xhr.status;
        }
        var responseObject = JSON.parse(xhr.responseText);
        task = responseObject.data;
      }
      if(!task.parentID) {
        return;
      }
      //Ok, now we have the task and it has a parent. Get the parent task and add it to the story box.
      var parentCallback = function(xhr, parentTask) {
        if(!parentTask) {
          if(4 != xhr.readyState) {
            return;
          }
          if(200 != xhr.status) {
            throw "Ajax to get parent task failed with code " + xhr.status;
          }
          var responseObject = JSON.parse(xhr.responseText);
          parentTask = responseObject.data;
        }
        //And now we have the parent task.  Do it up.
        addParentToStoryBox(storyBoxNode, parentTask);
        taskCache[parentTask.ID] = parentTask;
      };
      getTaskAsync(task.parentID, parentCallback);
    };
    getTaskAsync(taskId, callback);
  };
  
  var loadParentTask = function(storyBoxNode) {
    var taskId = storyBoxNode.getAttribute('data-objid');
    getParentTaskAsync(taskId, storyBoxNode);
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
    getTask : getTaskAsync,
    getParentTask : getParentTaskAsync,
    loadParentTask : loadParentTask
  };
  
})();
