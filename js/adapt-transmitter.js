import Adapt from 'core/js/adapt';

class Transmitter extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'componentView:postRender', this.onRender);
  }

  onRender (view) {
    const model = view.model;
    if (!this.checkIsEnabled(model)) {
      return;
    }
    this.setupListener(model, view);
  }

  setupListener(model, view) {
    this.listenTo(model, 'change:_isComplete', this.onComplete.bind(this, model, view));
  }

  onComplete(model, view) {
    const data = {};
    data.componentID = model.get('_transmitter')._componentURI || model.get('_id');
    data.componentType = model.get('_component');
    data.userAnswer = model.get('_userAnswer');
    data.items = model.get('_items');
    this.transmit(data);
  }

  async transmit(data) {
    try {
      const endpoint = Adapt.config.get('_transmitter')._endPoint;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Add any other headers if needed
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // console.log('Data successfully transmitted:', data);
      } else {
        console.error('Failed to transmit data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error while transmitting data:', error);
    }
  }

  checkIsEnabled(model) {
    const _model = model.get('_transmitter');
    if (!_model || !_model._isEnabled) return false;
    return true;
  }
}

export default new Transmitter();
