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
        if(choice) {
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

    }
}


//ITEMS
class AncientKey extends GameItem {
    describe() {
        return 'You pick up an Acient Key! I wonder what it opens...';
    }
}







Engine.load(Start, 'myStory.json');




