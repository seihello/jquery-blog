$(() => {
  $.get("https://jsonplaceholder.typicode.com/posts").done((postData) => {
    $.get("https://jsonplaceholder.typicode.com/comments").done((commentData) => {
      $.get("https://jsonplaceholder.typicode.com/users").done((userData) => {

        deployPosts(postData, commentData, userData)
        
      })
    })
  })
})

function deployPosts(postData, commentData, userData) {
  $.each(postData, (postIndex, post) => {

    let newPostElement = $(`
      <div class="post"></div>
    `)
    
    let userName = ""
    $.each(userData, (userIndex, user) => {
      if(user.id === post.userId) {
        userName = user.name
      }
    })

    newPostElement.append(`
      <h2>${post.title}</h2>
      <p class=author-name>Posted by ${userName}</p>
      <p>${post.body}</p>
    `)

    newPostElement.append(`
      <h3 class="comments-header">Show Comments</h3>
    `)

    let newCommentsElement = $(`
      <div class="comments"></div>
    `)
  
    $.each(commentData, (commentIndex, comment) => {
      if(comment.postId === post.id) {
        newCommentsElement.append(`
          <hr class="comment-partition">
        `)
        newCommentsElement.append(createCommentElement(comment.name, comment.body))
      }
    })
    newCommentsElement.children("hr:first").remove()

    let newCommentFormElement = $(`
      <div class="comment-form">
      </div>
    `)
    newCommentFormElement.append(`
      <h4>Leave a comment</h4>
      <label>Name:</label>
      <input type="text" placeholder="Eric Johnson" val="hoge">
      <label>Comment:</label>
      <textarea rows=5 cols=50 placeholder="Write a comment"></textarea>
      <button class="submit-comment")>Submit</button>
    `)
    newCommentsElement.append(newCommentFormElement)
    newPostElement.append(newCommentsElement)

    $("#posts").append(newPostElement)
  })

  $(".comments-header").on("click", (event) => {
    $(event.target).next().slideToggle(() => {
      if($(event.target).text() === "Hide Comments") {
        $(event.target).text("Show Comments")
      } else {
        $(event.target).text("Hide Comments")
      }
    })
  })

  $(".submit-comment").on("click", (event) => {
    const name = $(event.target).siblings("input").val()
    const comment = $(event.target).siblings("textarea").val()
    const newCommentElement = createCommentElement(name, comment)
    const lastCommentElement = $(event.target).parent().prevAll(".comment").first()
    lastCommentElement.after($(`<hr class="comment-partition">`), newCommentElement)

    $(event.target).siblings("input").val("")
    $(event.target).siblings("textarea").val("")
  })

}

function createCommentElement(name, comment) {
  const commentElement = $(`
    <div class="comment">
      <span class="comment-body">${comment}</span>
      <span class="comment-name">  — by ${name}</span>
    </div>
  `)
  return commentElement
}