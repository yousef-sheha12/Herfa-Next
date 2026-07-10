"use client";

import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
          <h3 className="text-lg font-bold text-slate-800">
            Something went wrong
          </h3>
          <p className="max-w-md text-sm text-slate-500">
            {this.state.error?.message ||
              "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
