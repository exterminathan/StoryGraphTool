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

        if (this.constructor === Location) {
            this.engine.show(locationData.Body);
        }
        
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
            if (choice.Text === 'Enter the Speakeasy') {
                if (!this.engine.storyData.Locations.SecretChamber.Variables.haveAncientKey) {
                    this.engine.show("An ancient lock hangs on the door, preventing entry. Maybe if I had something to open this with?..");
                    this.engine.gotoScene(Location, 'New York');
                } else {
                    this.engine.show("&gt; "+choice.Text);
                    this.engine.gotoScene(choice.SceneType, choice.Target);
                }
            } else {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(choice.SceneType, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class SecretChamber extends Location {
    create(key) {
        super.create(key);

        let locationData = this.engine.storyData.Locations[key];

        if (locationData.Body2) {
            this.engine.show(locationData.Body2);
        }

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
            this.engine.storyData.Locations[this.engine.currentLocation].Variables.haveAncientKey = true;
        }
    }
}

class Speakeasy extends Location {
    create(key) {
        super.create(key);

        let locationData = this.engine.storyData.Locations[key];

        if (locationData.Body) {
            this.engine.show(locationData.Body);
        }

        if (!this.engine.storyData.Locations['Speakeasy'].Variables.haveAntiqueLamp) {
            console.log('no lamp');
            for(let choice of locationData.NoLamp) { 
                this.engine.addChoice(choice.Text, choice); 
            }
            
        }

    }
 
    handleChoice(choice) {
        super.handleChoice(choice);

        if (choice && choice.Text === "Pickup Antique Lamp") {
            let locationData = this.engine.storyData.Locations[this.engine.currentLocation];  
            this.engine.storyData.Locations[this.engine.currentLocation].Variables.haveAntiqueLamp = true;

        }
    }
}

class KansasCity extends Location {
    create(key) {
        super.create(key);

        let locationData = this.engine.storyData.Locations[key];
        let speakeasyData = this.engine.storyData.Locations['Speakeasy'];

        if (!speakeasyData.Variables.haveAntiqueLamp) {
            this.engine.show(locationData.Body);
        } else {
            this.engine.show(locationData.Body2);
        }
    }
}



class End extends Scene {
    create() {
        this.engine.show("THE END! THANKS FOR TRAVELLING!");
        this.engine.show("We hope you found the key and the lamp!");
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}



Engine.load(Start, 'myStory.json');




