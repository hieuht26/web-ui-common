const { events } = require("bfj/src");

const topics = {};
const hOP = topics.hasOwnProperty;
class Events {
  /**
   * 
   * @param {String} topic 
   * @param {Fucntion} listener 
   * @returns 
   */
  subscribe(topic, listener) {
    // Create the topic's object if not yet created
    if (!hOP.call(topics, topic)) topics[topic] = [];

    // Add the listener to queue
    const index = topics[topic].push(listener) - 1;

    // Provide handle back for removal of topic
    return {
      remove: function() {
        delete topics[topic][index]
      }
    }
  }

  public(topic, info) {
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if (!hOP(topics, topic)) return;

    // Cycle through topics queue, fire
    topics[topic].forEach(function (item) {
      item(info !== undefined ? info : {});
    })
  }

  unsubscribe(topic) {
    delete topics[topic];
  }
}

const EvetObj = new Events();
export default EvetObj;