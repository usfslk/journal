---
title: Lumen, Social network using React.js and Firebase - Chapter 3 (Live Voting System)
description : Chapter 3 (Live Voting System)
date: '2018-10-14'
image: main.png
---

Welcome to the third and last chapter of 'Building a social network with React.js and Firebase'. In Chapter Two we covered the following topics:

 - Update and Delete posts
 - Build better UI with Semantic

In this part you’re going to implement a very popular feature, a Reddit-like vote but also dive deeper into using Semantic UI components.

### [Live Demo](https://lumen.protobulb.io/)
### [Source Code](https://github.com/usfslk/Lumen)

PR are welcome, here's some quick and easy-to-implement features:

- Sort the feed list by score
- Adding a username / displayName on signup
- Create separate components files

### Timestamp

Adding a timestamp to our posts is a very easy step using the moment.js library:
All we have to do is import it:

    import moment from "moment";

then send it to firebase along with the other variables:

    let timestamp = moment().format("LLL");

### Changing the app structure

Now we have two more pages for separate login/signup forms, and that's going to help us handle errors:
Using Message component from Semantic we can write this if a user entered a wrong password:

    <Route exact path="/" component={Home} />
    <Route path="/Account" component={Account} />
    <Route path="/Login" component={Login} />
    <Route path="/Signup" component={Signup} />

Login.js Alert:

    {this.state.error ? (
      <div>
        <Message negative>
          <Message.Header>
            Please double-check and try again
          </Message.Header>
          <p>The password you entered did not match our records.</p>
        </Message>
      </div>
    ) : null

And of course this one is when you provide duplicate email on signup:

    {this.state.error ? (
        <Message negative>
          <Message.Header>
            The email you entered is already in use
          </Message.Header>
          <p>
            Please choose another one or <a href="/login">login</a> to
            your account.
          </p>
        </Message>
    ) : null}

To mount/unmout these alerts just catch the error and change the state like so

    .catch(error => {
      this.setState({ error: true, loading: false });
    });

### Upvote / Downvote

Now let's begin by putting in place a variable named score:

    let score = 1;

As we saw in the previous articles, we have a parent object that contains array of posts inside object for each user, to be able to update the score directly from the front-end, we'll need to be able to write the correct path
to the post we're trying to upvote/downvote

Let's suppose we have this minimal `listItems`

    const listItems = this.state.list.map((item, index) =>
      Object.values(item).map((nestedItem, nestedIndex) => (
        <div>
            {nestedItem.title}
            <button
              onClick={() => this.upvote(nestedIndex, index)}
            >
            </button>
            <button
              onClick={() => this.downvote(nestedIndex, index)}
            >
            </button>
          </div>
      ))
    );

In order to write the path we're going to use index and nestedIndex, it can seems straighforward but I spent like half an hour doing `console.log`. Anyway, here's the functions, I highly recommend to take a look at how we initially saved `this.state.list` and `this.state.keys`

    upvote = (index, nestedIndex) => {
      fire
        .database()
        .ref(
          `/feed/${this.state.keys[nestedIndex]}/${
            Object.keys(this.state.list[nestedIndex])[index]
          }`
        )
        .once("value", snapshot => {
          var obj = snapshot.val().score;
          this.setState({ score: obj }, () => this.up(index,

            ));
        });
    };

    up = (index, nestedIndex) => {
      fire
        .database()
        .ref(
          `/feed/${this.state.keys[nestedIndex]}/${
            Object.keys(this.state.list[nestedIndex])[index]
          }`
        )
        .update({
          score: this.state.score + 1
        });
    };

Same thing for *downvote*, as you can imagine we just replace the plus with minus.  

### Better Profile Page

Rather than using cards for both pages, I decided to use tables for the account
page since there's less information to display but it also gives a cleaner look

    <Table
      fixed
      stackable
    >
      <Table.Body>
        <Table.Cell width={2}>
          <Image
            rounded
            id="smallIMG"
            src={item.picture}
            verticalAlign="middle"
          />
        </Table.Cell>
        <Table.Cell width={3}>
          <h3>{item.title}</h3>
        </Table.Cell>
        <Table.Cell width={2}>
          <h5>Score : {item.score}</h5>
        </Table.Cell>
        <Table.Cell width={3}>{item.timestamp}</Table.Cell>
        <Table.Cell textAlign="right" width={2}>
          {" "}
          <Button
            size="tiny"
            basic
            color="red"
            onClick={() => this.delete(index)}
          >
            <i class="icon close" />
            DELETE
          </Button>
        </Table.Cell>
      </Table.Body>
    </Table>

 <img width='100%' src="https://i.imgur.com/ciAJcrr.jpg" alt="badge">

### Conclusion

You can see the full implementation [here](https://github.com/usfslk/Lumen)

***If you enjoy my content, please consider supporting what I do.***

Thanks for reading!
