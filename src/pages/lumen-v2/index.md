---
title: Lumen, Social network using React.js and Firebase - Chapter 2 (Update and Delete)
description : Chapter 2 (Update and Delete)
date: '2018-10-11'
image: main.png
---

This is the second chapter of "Building a social network with Reajct.js and Firebase Tutorial Series", in Chapter One we covered the following topics:

 - Enable Firebase Auth and Database
 - Handle forms data
 - Login and create  an account
 - Send and retrieve data using firebase

 ### [Live Demo](https://lumen.protobulb.io/)
 ### [Source Code](https://github.com/usfslk/Lumen)

The app we built was a great starting point to understand how to communicate with Firebase services and use this platform as a cloud backend but most
of the big concepts of a social network wasn't there, like a public feed, editing and deleting posts, ect.. so in this article we'll focus on these features.

I pretty much ditched all the front-end code in the old repo because bootstrap wasn't really helping me, I came across an awesome library called
Semantic UI and that's what we're going to use.

I did find the number of components greater than what's available in bootstrap, and also the customization was really fun because this ui library works great with React. The only downside is the complexity of responsive grids and changing default theme variables, not that straightforward compared to bootstrap.

> This is more an overview lesson than a step by step tutorial

PR are welcome, here's some quick and easy-to-implement features:

- Invert the feed list (most recent on top)
- Adding a username / displayName on signup
- Adding timestamp to user posts
- Create separate components files

Let's open a text editor and start writing some magic, first thing you'll notice is that we now have a public feed that anyone can view without creating an account which is pretty normal for a social network, second important thing is the ability to delete and edit personal posts.

For the editing part, I didn't come up with an intuitive way to edit each post separately, I tried to keep it simple and not use props and dynamic navigation. Maybe in the future, I'll create a separate blog post to introduce you guys to this concept.

Anyway let's start with the header, nothing complicated there, few buttons to navigate in our app, as mentioned previously the ui components are now built with semantic-ui-react. Also you'll need react-router-dom in order to handle navigation so go ahead and install those libraries

    yarn add react-router-dom semantic-ui-react

Home

    <Button
      id="headerBTN"
      compact
      color="black"
      href="/"
    >
      Home
    </Button>


Login / Signup / Account

    <Button
      id="headerBTN"
      compact
      color="green"
      href="/account"
    >
      {this.state.loggedIn ? 'Account' : 'Log in'}
    </Button>

Next thing is to create main routes like so:

<Route exact path="/" component={Home} />
<Route path="/Account" component={Account} />

Of course you'll have to import those two pages in the top of your App.js and wrap everything inside `<Router> ... </Router>`

This app is basically a social network so when users visit the website they expect to see some kind of posts and that's exactly what we're going to build, like the function we used in the previous article, we need to retrieve data from Firebase but this time each user have a separate feed and that's a great solution because it makes our app scalable (if you wish to add 'follow' feature for example).

![enter image description here](https://i.stack.imgur.com/IOpOL.png)

The data is still coming form the same path but since each users have a separate feed we need to loop through a parent object that contains an object for each user which contains an array of posts, to render our view we have to write something similar to this:


        const listItems = this.state.list.map((item, index) =>
            Object.values(item).map(nestedItem => (
              <p>
                {nestedItem.title}
              </p>
            ))
          );

The social cards are very similar to the ones we created with bootstrap, the Semantic UI docs provide many great [examples](http://react.semantic-ui.com/views/card/) to quickstart your project, in this lesson we'll be using this:

    <Card>
      <Image
        id="mainIMG"
        src={nestedItem.picture}
      />
      <Card.Content>
        <Card.Header>
          {nestedItem.title}
        </Card.Header>
        <Card.Description>
          {nestedItem.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <a>
          <Icon name="user" />
          by {nestedItem.user}
        </a>
      </Card.Content>
    </Card>

That's it for the homepage, we'll keep it simple. Now navigate to account page and import this:

    import {
      Button,
      Form,
      Grid,
      Header,
      Image,
      Icon,
      Card,
      Loader,
      Container,
      Divider,
      Label,
      Feed,
    } from 'semantic-ui-react';

The first element on the page is the 'CREATE LUMEN' button that provide us the ability to send data to firebase, it's the same function used previously we only change the path of the database to create separate feeds, we can achieve that by requesting `loggedIn` user information:

    const { currentUser } = fire.auth();

and then inside the `new()` function we use:

    fire
      .database()
      .ref(`feed/${currentUser.uid}/`)
      .push({
        title,
        description,
        picture,
        user: currentUser.email,
      })

`auth()` method can also provide `displayName`, `email`, `photoURL`, `emailVerified` and `providerId`.

If you wish to learn more : https://firebase.google.com/docs/auth/web/manage-users

A header, icon and divider to create a separation between the compose component and the settings one. The main function of that blue button is to make the api call when the user decide to edit personal lumens, if that component was in a separate page we rather write the api call inside `componentDidMount`, anyhow here we are looking at the `account()` function, very similar to one we used on `Home.js`, the only difference is the database path.

To make the settings component appear onClick I used this:

    showSetting = () => {
      this.setState({
        showSetting: !this.state.showSetting,
        loading: true,
      });
      this.account();
    };

The `listItems` const is very long because I always promise to myself to keep things simple but end up with a hundred lines of code, this is a minimal version of it so you can understand what's going on:
![fun](https://i.imgur.com/QUy6npF.jpg)

    const listItems = this.state.list.map((item, index) => (
    <Card fluid>

        <h1>{item.title}</h1>
        <Image
          src={item.picture}
          size="tiny"
        />
        {item.description}

        <a onClick={() => this.delete(index)}
        class="ui white label">
          DELETE
        </a>

        {this.state.showEdit ? (
          <Form>
              <Form.Input
                onChange={this.handleChange}
                name="updateTitle"
                label="A cool title"
                placeholder={item.title}
                required
              />
              <Form.Input
                fluid
                onChange={this.handleChange}
                name="updatePicture"
                label="Picture URL"
                placeholder={item.picture}
                required
              />
            <Form.TextArea
              autoHeight
              rows={4}
              onChange={this.handleChange}
              name="updateDescription"
              label="What's on your mind?"
              placeholder={item.description}
              required
            />

            <Button
            onClick={() => this.update(index)}
            >
              UPDATE
            </Button>
          </Form>
        ) : null}

    </Card>
    ));



Two mains buttons there **DELETE** and **UPDATE**, first one we have to provide the *index* so we can tell firebase which post to delete and same thing for update:

    delete = index => {
      const { currentUser } = fire.auth();
      fire
        .database()
        .ref(
          `feed/${currentUser.uid}/${this.state.keys[index]}`
        )
        .remove();
    };

The technique below to edit posts is working but not suitable for large scale app, we'll try to focus on how to perform the operations and forget a little bit about user experience, so I create this function called `edit` to switch the state of **EDIT MODE**:

    edit = index => {
      this.setState({ showEdit: !this.state.showEdit });
    };

when it's enabled the form will appear below the post and then you click on the update button which execute this code:

    update = index => {
      const { currentUser } = fire.auth();
      this.setState({ loading: true });
      fire
        .database()
        .ref(
          `feed/${currentUser.uid}/${this.state.keys[index]}`
        )
        .update({
          title: this.state.updateTitle,
          description: this.state.updateDescription,
          picture: this.state.updatePicture,
        })
        .then(() => {
          this.setState({
            loading: false,
          });
        });
    };

You can see the full implementation [here](https://github.com/usfslk/Lumen)

***If you enjoy my content, please consider supporting what I do.***


Thanks for reading!
