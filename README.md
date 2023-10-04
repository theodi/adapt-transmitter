# adapt-transmitter

**transmitter** is an *extension* to transmit component completion state data to an API endpoint. It is write only, so it does not read back statements.

An example use case is to enable this on a question component and to send answers to a third party API which can then be used for analysis. This give more flexability than an LMS to process data. It is write only as this plugin is not designed to track and restore state, that is what SCORM and XAPI are for.

# Creating an API

You will need a location somewhere that accepts a post request. Currently the data sent includes:
* ComponentID
* _userAnswer
* _items (eg. for MCQ)
* _component (component type, eg. MCQ)

Once you have the data you can do what you like with it, even create a service that feeds another component.

# Example API (nodejs and express)

The following function is an example of a function that processes a request and stored the data in a mongodb. You will need to add your own monogodb connection code.


    app.post('/userAnswer', express.json(), async function(req, res) {
      // Extract relevant data from the request body
      const { componentID, componentType, userAnswer, items } = req.body;
    
      // Check if the required fields are present in the request body
      if (!componentID || !componentType || !userAnswer || !items) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    
      const timestamp = new Date().getTime();
    
      try {
        // Assuming you have a database connection similar to 'dbo.getDb()'
        var dbConnect = dbo.getDb();
    
        const newUserAnswer = {
          timestamp,
          componentID,
          componentType,
          userAnswer,
          items,
        };
    
        const transmitterDataCollection = dbConnect.collection('TransmitterData');
    
        // Insert the new userAnswer into the "TransmitterData" collection
        const result = await transmitterDataCollection.insertOne(newUserAnswer);
    
        // Return the ID of the created object to the user
        res.status(201).json({ id: result.insertedId });
      } catch (err) {
        // Handle any errors that occur during the database operation
        console.error('Error saving userAnswer:', err);
        res.status(500).json({ error: 'Error saving userAnswer' });
      }
    });


----------------------------
**Version number:**  1.0.0
**Framework versions:**  5.17.7+     
**Author / maintainer:**  [Open Data Institute](https://github.com/theodi/)    
**Accessibility support:**    
**RTL support:**  
**Cross-platform coverage:** 
