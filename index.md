# Time tracking API as a recruitment task

API created with NestJS - it uses a PostreSQL Database for storing tracking data.

## Requirenments

API whas meant to meet those requirenments:

- As a user, I want to be able to start tracking the new, named Task so that tracking of previously started task is stopped, and start time of the new Task is saved.
- As a user, I want to be able to stop tracking task at any moment so that the task finish time is saved.
- As a user, I want to be able to fetch current running task.

No authorization or authentication provided. API is meant for one user.

API has also some implemented jest tests:

![image](https://user-images.githubusercontent.com/38647517/128626888-955c67cc-35ee-447a-9087-d64a8ee3dbe0.png)
      ![image](https://user-images.githubusercontent.com/38647517/128626923-24cd701b-26ea-4fc5-926e-58b8430badbd.png)

## API Documentation

I will provide a description for non basic NestJS project futures.

### Methods

###  1. create task
  
  Used for creating new task.
  
  ### Request
  
  Method | URL
  -------|-----
  POST | api/tasks
  
  Type | Params | Values
  -----|--------|--------
  POST | name | string
  POST | start_date | string (ISO8601 format)
  
  ### Response
  
  If creating the task went successfully:
``` markdown
{ 
  "id": <task_id>,
  "name": <task_name>,
  "start_date": <task start date>,
  "end_date": null
  }
```
  
  If ```start_date``` of not ended task is greater than ```start_date``` of new task:
  ```markdown
  null
  ```
  
  If parameters are not in proper format:
```markdown
{
  "statusCode": 400,
  "message": [
    "Name must be a string.",
    "start_date must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request"
}
```
  
###  2. stop task
  
  Used for stopping currently active task.
  
  ### Request
  
  Method | URL
  -------|-----
  PATCH | api/tasks
  
  Type | Params | Values
  -----|--------|--------
  PATCH | end_date | string (ISO8601 format)
  
  ### Response
  
  If stopping of task went successfully :
```markdown
{ 
  "id": <task_id>,
  "name": <task_name>,
  "start_date": <task start date>,
  "end_date": <tasks end date>
}
```

If ```start_date``` of that task is greater than its ```end_date```:
  ```markdown
  null
  ```
  
  If parameters are not in proper format:
```markdown  
{
  "statusCode": 400,
  "message": [
    "end_date must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request"
}
```
  
###  2. get active task
  
  Used for getting currently active task.
  
  ### Request
  
  Method | URL
  -------|-----
  GET | api/tasks
  
  ### Response
  
  If there is a currently active task:
```markdown
{ 
  "id": <task_id>,
  "name": <task_name>,
  "start_date": <task start date>,
  "end_date": null
}
```

If there is not a currently active task:
  ```markdown
  null
  ```

## Summary

It was my fist expiriance in creating tests in NestJS and writing an documentation. I hope it will be usefull in some way :)
