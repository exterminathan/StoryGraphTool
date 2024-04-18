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
        if (choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class SecretChamber extends Location {
    create(key) {
        super.create(key);

        let locationData = this.engine.storyData.Locations[key];

        if (!locationData.Variables.haveAncientKey) {
            console.log('no key');
            for(let choice of locationData.NoKey) { 
                this.engine.addChoice(choice.Text, choice); 
            }
        }

    }

    handleChoice(choice) {
        super.handleChoice(choice);

        if (choice && choice.Text === "Pick up the ancient key") {
            let locationData = this.engine.storyData.Locations[this.engine.currentLocation];  
            locationData.Variables[0].haveAncientKey = true;
        }
    }
}



class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}



Engine.load(Start, 'myStory.json');




