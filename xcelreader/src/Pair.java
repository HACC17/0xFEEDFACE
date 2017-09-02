public class Pair<L, R>{
    private L left;
    private R right;

    public Pair(L left, R right) {
        this.left = left;
        this.right = right;
    }

    public L left() {
        return this.left;
    }

    public R right() {
        return this.right;
    }

    @Override
    public int hashCode() {
        return (left.hashCode() ^ right.hashCode());
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pair)) return false;

        Pair pairo = (Pair) o;
        return this.left.equals(pairo.left())
                && this.right.equals(pairo.right());
    }
}
