import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Image } from 'react-konva';

class ImageWrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      image: null
    };
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = this.props.image;
    image.onload = () => this.setState({ image });
  }

  render() {
    const { width, height, x, y } = this.props;
    return (
      <Image
        image={this.state.image}
        width={width}
        height={height}
        x={x}
        y={y}
      />
    );
  }
}

ImageWrapper.propTypes = {
  image: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default ImageWrapper;
