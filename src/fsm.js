class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config==null) throw new Error;

        this.initialState=config.initial;
        this.states=config.states;
        this.currentState= this.initialState;
        this.possibleTransitions=this.states[this.currentState].transitions;

        this.historyTransitions=[];
        this.historyUndo=[];
        this.flag=false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.states[state]){
            this.historyTransitions.push(this.currentState);
            this.currentState=state;
            this.possibleTransitions=this.states[this.currentState].transitions;
            this.flag=true;
        } else throw new Error;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(this.possibleTransitions[event]){           
            this.changeState(this.possibleTransitions[event]);
            this.flag=true;
        } else throw new Error;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState= this.initialState;
        this.possibleTransitions=this.states[this.currentState].transitions;
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let temp=[];
        if(!event){
            for(const s in this.states ){   
                temp.push(s);     
            }
            return temp;
        }       
        else{            
            for(const s in this.states ){               
                for(const a in this.states[s].transitions ){                
                    if(a===event) temp.push(s);                
              }
            }
            return temp;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {        
        if(this.historyTransitions.length===0) return false;
        else{
            this.historyUndo.push(this.currentState);
            this.currentState=this.historyTransitions.pop();
            this.possibleTransitions=this.states[this.currentState].transitions; 
            this.flag=false;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.historyUndo.length===0 || this.flag)  return false; 
        else{
            let k= this.historyUndo.pop();
            this.historyTransitions.push(k);
            this.currentState=k;
            this.possibleTransitions=this.states[this.currentState].transitions;              
            return true;            
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.historyTransitions=[];
        this.historyUndo=[];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
