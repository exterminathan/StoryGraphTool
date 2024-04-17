//SCENES
class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.engine.currentLocation = key;
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if(locationData.Choices && locationData.Choices.length > 0) {
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); 
                
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice && choice.Requires) {
            // Check if the required item is picked up
            const itemPickedUp = this.engine.storyData.Items[choice.Requires].pickedUp;
            if (!itemPickedUp) {
                this.engine.show("You need the " + choice.Requires + " to proceed.");
                this.create(this.engine.currentLocation); // Assuming currentLocation is tracked

                return; // Exit the function to prevent scene change
            }
        }
        // If item is picked up or no item is required, proceed as usual
        if (choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

//Locations
class SecretChamber extends Location {
    create(key) {
        super.create(key); 
        
        let pickedUp = this.engine.storyData.Items['AncientKey'].pickedUp;
        console.log("Ancient key picked up:", pickedUp);

        if (pickedUp) {
            this.engine.removeChoice("Pick up the ancient key");
        } else {
            this.engine.addChoice("Pick up the ancient key", {
                Text: "Pick up the ancient key",
                Item: "AncientKey"
            });
        }
    }

    handleChoice(choice) {
        super.handleChoice(choice);
        if (choice && choice.Item === 'AncientKey') {
            this.engine.storyData.Items['AncientKey'].pickedUp = true;
            this.engine.removeChoice('Pick up the ancient key');

            console.log("key picked up, state changed: ", this.engine.storyData.Items['AncientKey'].pickedUp);
            
        }

        console.log("current state of item array:", this.engine.storyData.Items);
    }
}


//ITEMS
class AncientKey extends GameItem {
    describe() {
        return 'You pick up an Acient Key! I wonder what it opens...';
    }
}


Engine.load(Start, 'myStory.json');




