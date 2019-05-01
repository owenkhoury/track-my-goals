import React, { useState, useEffect } from 'react';
import fire from './fire';
import { createGoal } from './utils';


function App() {
  const [list, setList] = useState([])

  useEffect(() => {
    
  })

  function addNewGoal() {
    createGoal({Message: "Owen message"})
  }

  return (
    <div>
      <button onClick={() => createGoal()}>
        Click me
      </button>
      <h1>Sup</h1>
      <p>
        {list}
      </p>
    </div>
  )
}

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { messages: [] }; // <- set up react state
//   }

  
//   addMessage(e){
//     e.preventDefault(); // <- prevent form submit from reloading the page
//     /* Send the message to Firebase */
//     fire.database().ref('messages').push( this.inputEl.value );
//     this.inputEl.value = ''; // <- clear the input

//     const db = fire.firestore();
    
//     const commentRef = db.collection("messages").add({
//       Message: 'whats up'
//     });


//   }
//   render() {
//     return (
//       <form onSubmit={this.addMessage.bind(this)}>
//         <input type="text" ref={ el => this.inputEl = el }/>
//         <input type="submit"/>
//         <ul>
//           { /* Render the list of messages */
//             this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
//           }
//         </ul>
//       </form>
//     );
//   }
// }

export default App;