---
title: Smooth ListView and 60FPS animations with React Native
description : React Native Overview Lesson
date: '2018-10-08'
image: main.png
---

Today we'll talk about ListView and how bad React Native performance is with this library. Even in the official docs they suggest to use FlatList and implement many tweaks but I don't think it's a good alternative. In this tutorial we'll customize the app we built in the first chapter, KotScotch, the famous quotes single-page feed.

<p align="center">
 <img src="https://media.licdn.com/dms/image/C4D12AQGxI8UAQvTlOQ/article-inline_image-shrink_1500_2232/0?e=1545264000&v=beta&t=qPaErTVHOYn0kXSp8IiFd5jX43OX2APW3mxH_VT-Xw8" alt="badge">
</p>

The goal here is to make the header image change opacity onScroll as well as changing its scale when reaching the top of the list. Pretty easy to implement but the problem here is that these updates over the bridge take place on every frame.

React Native bridge is a C++/Java bridge which is responsible for communication between the native and Javascript thread. Trying to implement this without a good understanding of how animations should perform will result in an unusable app or below average, performance-wise.

Thanks to the excellent work driven by Tal [Tal Kol](https://github.com/talkol), with [rn-perf-experiments](https://github.com/wix-incubator/rn-perf-experiments)

Staring by the API call because obviously we need some data to work with, we're using same endpoint that returns 100 items. It's a good example to test React Native performance.

    apiCall() {

       let url = "https://talaikis.com/api/quotes/"

        fetch(url)

         .then((response) => response.json())

         .then((responseJson) => {

          this.setState({

           dataSource: this.state.dataSource.cloneWithRows(responseJson),

          });

         })

       }

Initializing the app

       constructor(props) {

           super(props);

           var dataSource = new ListView.DataSource({rowHasChanged:(r1,r2) => r1 != r2});

           this.state = {

            scrollY: new Animated.Value(0),

            dataSource: dataSource.cloneWithRows(quotes),

           };

          }

Let’s scaffold the UI and hook up the corresponding animated values to make that happen. I’ll be omitting some of the code parts for selectively showing what matters. You’ll be able to check the full source code later on.

    renderRow(row) {

        return (

         <View style={styles.card}>

          <Text style={styles.quote}>{row.quote}</Text>

          <Text style={styles.author}>{row.author}</Text>

         </View>

        );

       }

       renderHeader() {

        return <View style={styles.blockheader} />;

       }


The header is just an empty view to give the user a better feel of the animation

     blockheader: {

         height: (height / 2) - 50 ,

     },
The Animated API was designed with a very important constraint in mind, it is serializable. This means we can send everything about the animation to native before it has even started and allows native code to perform the animation on the UI thread without having to go through the bridge on every frame (Facebook Docs)

    renderScroll(props) {

         return (

         <Animated.ScrollView

          {...props}

          scrollEventThrottle={16}

          onScroll={

            Animated.event([{

    	       nativeEvent: { contentOffset: { y: this.state.scrollY } }

            }], {

    	       useNativeDriver: true

            })

           }

          />

        );

       }    
The scrollEventThrottle is to control how often the scroll event will be executed (in milliseconds). A lower number can be supplied to better accuracy. The scrollY represents the value of Animated.event running on the UI thread. By setting useNativeDriver: true we can avoid keyframes calculation on the JavaScript thread.

For more information about using native driver for animations I recommend reading this detailed article

Animated.Image, a different approach
Animations are heavily configurable. Custom and predefined easing functions, delays, durations, decay factors, spring constants, and more can all be tweaked depending on the type of animation that you want to achieve.

Using the native thread things like `transform`, `backgroundColor` and `opacity` will work but `flexbox` and `position` properties won't. Keep that in mind.

    <Animated.Image

         style={[styles.backgroundImage, {

          opacity: this.state.scrollY.interpolate({

           inputRange: [0, 350],

           outputRange: [1.5, 0]

          }),

          transform: [{

           scale: this.state.scrollY.interpolate({

            inputRange: [-300, 0, 1],

            outputRange: [2, 1, 1]

           })

          }]

         }]}

         source={require('../assets/bg.jpg')}

        />

A trick I did find when reading the docs is explicitly setting `initialListSize`

    <ListView

       dataSource={this.state.dataSource}

       initialListSize={size}

       enableEmptySections={true}

       renderRow={this.renderRow.bind(this)}

       renderHeader={this.renderHeader.bind(this)}

       renderScrollComponent={this.renderScroll.bind(this)}

      />  
There’s plenty to learn about animation in React Native.   

You can see the full implementation [here](https://github.com/usfslk/KotScotch)

If you enjoy my content, please consider supporting what I do.

Thanks for reading!
