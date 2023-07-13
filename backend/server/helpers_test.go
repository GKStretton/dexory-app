package server

import (
	"testing"
)

func TestStringSlicesEqual(t *testing.T) {
	tests := []struct {
		name string
		a    []string
		b    []string
		want bool
	}{
		{
			name: "identical slices",
			a:    []string{"abc", "def", "ghi"},
			b:    []string{"abc", "def", "ghi"},
			want: true,
		},
		{
			name: "equal slices in different order",
			a:    []string{"ghi", "abc", "def"},
			b:    []string{"abc", "def", "ghi"},
			want: true,
		},
		{
			name: "unequal slices with common elements",
			a:    []string{"abc", "def", "ghi"},
			b:    []string{"abc", "def", "xyz"},
			want: false,
		},
		{
			name: "unequal slices with no common elements",
			a:    []string{"abc", "def", "ghi"},
			b:    []string{"jkl", "mno", "pqr"},
			want: false,
		},
		{
			name: "unequal lengths",
			a:    []string{"abc", "def"},
			b:    []string{"abc", "def", "ghi"},
			want: false,
		},
		{
			name: "both empty",
			a:    []string{},
			b:    []string{},
			want: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := stringSlicesEqual(tt.a, tt.b); got != tt.want {
				t.Errorf("stringSlicesEqual() = %v, want %v", got, tt.want)
			}
		})
	}
}
