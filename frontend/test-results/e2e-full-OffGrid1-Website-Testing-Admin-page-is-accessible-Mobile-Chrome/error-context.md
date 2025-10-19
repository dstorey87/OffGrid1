# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - navigation [ref=e12]:
    - generic [ref=e14]:
      - link "OffGrid1" [ref=e15] [cursor=pointer]:
        - /url: /
        - img [ref=e17]
        - generic [ref=e23]: OffGrid1
      - generic [ref=e24]:
        - button "Toggle theme" [ref=e25] [cursor=pointer]:
          - img [ref=e26]
        - button "Toggle mobile menu" [ref=e32] [cursor=pointer]:
          - img [ref=e33]
  - main [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - heading "Admin Access" [level=3] [ref=e38]
        - paragraph [ref=e39]: Enter password to access admin panel
      - generic [ref=e41]:
        - textbox "Admin password" [ref=e42]
        - button "Login" [ref=e43] [cursor=pointer]
```