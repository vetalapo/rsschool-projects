#!/bin/bash
echo "Pushing to both origin and rs repos..."
echo

git push origin --all && git push rs --all

echo
echo "Done"
