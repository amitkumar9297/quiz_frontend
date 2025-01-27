import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  /**
   * When the component's subtree contains an error, this method is invoked by
   * React. It is given the error as a parameter and is expected to return a value
   * which will be used to set the component's state. The default implementation
   * sets the `hasError` state to true.
   *
   * @param error The error that was thrown
   * @returns A state object with `hasError` set to true
   */
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  /**
   * This method is invoked when the component is rendered. If the component is
   * in an error state, it renders a fallback message. Otherwise, it renders the
   * children that were passed to it.
   *
   * @returns A JSX element that represents the component's UI
   */
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;